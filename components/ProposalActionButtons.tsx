'use client';

import { useTransition } from 'react';
import { acceptProposal, rejectProposal } from '@/app/actions/proposals';
import { Check, X, Loader2 } from 'lucide-react';

interface Props {
  proposalId: number;
  status: string;
}

export default function ProposalActionButtons({ proposalId, status }: Props) {
  const [isPending, startTransition] = useTransition();

  if (status === 'ACCEPTED') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
        <Check className="w-3.5 h-3.5" /> Accepted & Booked
      </span>
    );
  }

  if (status === 'REJECTED') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-xl">
        Declined
      </span>
    );
  }

  const handleAccept = () => {
    startTransition(async () => {
      try {
        await acceptProposal(proposalId);
      } catch (err: any) {
        alert(err.message || 'Error accepting proposal');
      }
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      try {
        await rejectProposal(proposalId);
      } catch (err: any) {
        alert(err.message || 'Error declining proposal');
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleAccept}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl shadow-sm transition disabled:opacity-50"
      >
        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
        Accept & Book
      </button>

      <button
        onClick={handleReject}
        disabled={isPending}
        className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 font-medium text-xs px-2.5 py-1.5 rounded-xl transition"
      >
        <X className="w-3.5 h-3.5" />
        Decline
      </button>
    </div>
  );
}
