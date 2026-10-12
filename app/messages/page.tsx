import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import ChatWindow from '@/components/ChatWindow';
import Link from 'next/link';
import { MessageSquare, Sparkles } from 'lucide-react';

interface Props {
  searchParams: Promise<{
    conversationId?: string;
  }>;
}

export default async function MessagesPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  const resolvedParams = await searchParams;
  const activeConvId = resolvedParams.conversationId
    ? parseInt(resolvedParams.conversationId, 10)
    : undefined;

  // Find conversations where user is either client or freelancer
  const conversations = user
    ? await prisma.conversation.findMany({
        where: {
          proposal: {
            OR: [
              { freelancer: { userId: user.id } },
              { job: { event: { client: { userId: user.id } } } },
            ],
          },
        },
        include: {
          proposal: {
            include: {
              job: {
                include: {
                  event: {
                    include: {
                      client: {
                        include: { user: true },
                      },
                    },
                  },
                },
              },
              freelancer: { include: { user: true } },
            },
          },
          messages: {
            include: {
              sender: {
                select: { fullName: true, profilePicture: true },
              },
            },
            orderBy: { sentAt: 'asc' },
          },
        },
        orderBy: { id: 'desc' },
      })
    : [];

  const activeConversation =
    conversations.find((c) => c.id === activeConvId) || conversations[0];

  // Resolve counterpart for the active thread
  let activeOtherParty = { fullName: 'Participant', profilePicture: null as string | null };
  if (activeConversation && user) {
    const isClientViewer = user.id === activeConversation.proposal.job.event.client.userId;
    activeOtherParty = isClientViewer
      ? activeConversation.proposal.freelancer.user
      : activeConversation.proposal.job.event.client.user;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      <div>
        <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider block mb-1">
          Occasion Collaboration
        </span>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Direct Messages & Inquiries
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Private, 1-on-1 direct messaging threads between occasion hosts and hired specialists or crews.
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-zinc-200 dark:border-zinc-800">
          <MessageSquare className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
            No active conversations yet
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Conversations are automatically started when a proposal is submitted or an occasion service is booked.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Thread List */}
          <div className="md:col-span-1 bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-2">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-2 block mb-2">
              Recent Threads ({conversations.length})
            </span>

            <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
              {conversations.map((conv) => {
                const isClientViewer = user?.id === conv.proposal.job.event.client.userId;
                const otherParty = isClientViewer
                  ? conv.proposal.freelancer.user
                  : conv.proposal.job.event.client.user;
                const isSelected = activeConversation?.id === conv.id;
                const lastMessage = conv.messages[conv.messages.length - 1];

                return (
                  <Link
                    key={conv.id}
                    href={`/messages?conversationId=${conv.id}`}
                    className={`block p-3 rounded-2xl transition ${
                      isSelected
                        ? 'bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 shadow-sm'
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          otherParty.profilePicture ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'
                        }
                        alt={otherParty.fullName}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                            {otherParty.fullName}
                          </p>
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate">
                          {conv.proposal.job.event.title}
                        </p>
                        {lastMessage && (
                          <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                            {lastMessage.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Active Chat Window */}
          <div className="md:col-span-2">
            {activeConversation ? (
              <ChatWindow
                key={activeConversation.id}
                conversationId={activeConversation.id}
                currentUserId={user?.id || 1}
                otherPartyName={activeOtherParty.fullName}
                otherPartyAvatar={activeOtherParty.profilePicture}
                eventTitle={activeConversation.proposal.job.event.title}
                initialMessages={activeConversation.messages as any}
              />
            ) : (
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-zinc-500">Select a conversation thread</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
