'use client';

import { useState, useTransition } from 'react';
import { submitProposal } from '@/app/actions/proposals';
import { DollarSign, Send, X, CheckCircle2 } from 'lucide-react';

interface Props {
  jobId: number;
  jobTitle: string;
  categoryName: string;
  budget: any;
  deadline: string;
}

export default function ProposalModal({ jobId, jobTitle, categoryName, budget, deadline }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState(budget ? Number(budget).toString() : '350');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await submitProposal(jobId, formData);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setIsOpen(false);
        }, 1800);
      } catch (err: any) {
        alert(err.message || 'Failed to submit proposal');
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-sm transition"
      >
        <Send className="w-3.5 h-3.5" />
        Submit Bid / Proposal
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {isSuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Proposal Submitted!
                </h3>
                <p className="text-sm text-zinc-500">
                  The client has received your proposal and bid. You can track this in your Provider Hub.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-5">
                  <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
                    {categoryName}
                  </span>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                    Bid for: {jobTitle}
                  </h3>
                  {budget && (
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Client target budget: <span className="font-semibold text-zinc-800 dark:text-zinc-200">${Number(budget)}</span>
                    </p>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Your Bid Amount ($ USD)
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        name="bidAmount"
                        required
                        step="1"
                        min="10"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-9 pr-3.5 py-2.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Proposal Message & Pitch
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      placeholder="Explain your approach, why your solo or group expertise is ideal, and what is included in your price..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-sm py-3 rounded-xl transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {isPending ? 'Sending Proposal...' : 'Send Proposal to Client'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
