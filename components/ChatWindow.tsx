'use client';

import { useState, useEffect, useRef, useTransition, useCallback } from 'react';
import { sendMessage } from '@/app/actions/messages';
import { Send, Loader2 } from 'lucide-react';

interface MessageItem {
  id: number;
  senderId: number;
  message: string;
  sentAt: string | Date;
  sender: {
    fullName: string;
    profilePicture: string | null;
  };
}

interface Props {
  conversationId: number;
  currentUserId: number;
  otherPartyName: string;
  otherPartyAvatar: string | null;
  eventTitle: string;
  initialMessages: MessageItem[];
}

export default function ChatWindow({
  conversationId,
  currentUserId,
  otherPartyName,
  otherPartyAvatar,
  eventTitle,
  initialMessages,
}: Props) {
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Track optimistic message texts so we can deduplicate when server data arrives
  const optimisticTextsRef = useRef<Set<string>>(new Set());
  const prevConvIdRef = useRef<number>(conversationId);

  // When the conversation changes (user selects a different thread), reset completely.
  // When the same conversation gets new server data (revalidation), merge carefully
  // to avoid duplicating optimistic messages.
  useEffect(() => {
    if (conversationId !== prevConvIdRef.current) {
      // Different conversation selected — full reset
      setMessages(initialMessages);
      optimisticTextsRef.current.clear();
      prevConvIdRef.current = conversationId;
    } else {
      // Same conversation — server revalidated data arrived.
      // The server data is the source of truth. Any optimistic messages whose
      // text now appears in server data should be dropped (they were persisted).
      setMessages((prev) => {
        const serverIds = new Set(initialMessages.map((m) => m.id));
        // Keep server messages as base, then append any optimistic messages
        // that haven't been confirmed by the server yet.
        const pendingOptimistic = prev.filter(
          (m) => m.id > 1_000_000_000_000 && !serverIds.has(m.id)
        );

        // Filter out optimistic messages whose text already exists in server data
        // (meaning the server has persisted them)
        const serverTexts = new Set(
          initialMessages
            .filter((m) => m.senderId === currentUserId)
            .map((m) => m.message)
        );

        const stillPending = pendingOptimistic.filter(
          (m) => !serverTexts.has(m.message)
        );

        return [...initialMessages, ...stillPending];
      });
    }
  }, [conversationId, initialMessages, currentUserId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const trimmedText = inputText.trim();

    const tempMessage: MessageItem = {
      id: Date.now(),
      senderId: currentUserId,
      message: trimmedText,
      sentAt: new Date(),
      sender: {
        fullName: 'You',
        profilePicture: null,
      },
    };

    setMessages((prev) => [...prev, tempMessage]);
    optimisticTextsRef.current.add(trimmedText);
    setInputText('');

    startTransition(async () => {
      try {
        await sendMessage(conversationId, trimmedText);
      } catch (err: any) {
        // Remove the optimistic message on failure
        setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
        optimisticTextsRef.current.delete(trimmedText);
        alert(err.message || 'Failed to send message');
      }
    });
  };

  return (
    <div className="flex flex-col h-[560px] bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/60 dark:bg-zinc-900/60">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={otherPartyAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={otherPartyName}
            className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
          />
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {otherPartyName}
            </h3>
            <p className="text-[11px] text-zinc-400 truncate max-w-xs">
              Occasion: {eventTitle}
            </p>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((m) => {
          const isMe = m.senderId === currentUserId;
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  isMe
                    ? 'bg-purple-600 text-white rounded-br-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-sm'
                }`}
              >
                {m.message}
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 px-1">
                {new Date(m.sentAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2 bg-zinc-50/40 dark:bg-zinc-900/40"
      >
        <input
          type="text"
          placeholder={`Message ${otherPartyName}...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          disabled={isPending || !inputText.trim()}
          className="bg-purple-600 hover:bg-purple-700 text-white p-2.5 rounded-xl transition disabled:opacity-50 flex items-center justify-center"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
}
