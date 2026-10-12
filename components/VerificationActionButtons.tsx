'use client';

import { useTransition } from 'react';
import { toggleUserVerification } from '@/app/actions/admin';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface Props {
  freelancerId: number;
  isVerified: boolean;
}

export default function VerificationActionButtons({ freelancerId, isVerified }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (newStatus: boolean) => {
    startTransition(async () => {
      try {
        await toggleUserVerification(freelancerId, newStatus);
      } catch (err: any) {
        alert(err.message || 'Error updating verification');
      }
    });
  };

  if (isVerified) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
        </span>
        <button
          onClick={() => handleToggle(false)}
          disabled={isPending}
          className="text-xs text-zinc-400 hover:text-rose-600 font-medium transition"
        >
          Revoke
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => handleToggle(true)}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl shadow-sm transition disabled:opacity-50"
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <CheckCircle2 className="w-3.5 h-3.5" />
      )}
      Approve & Verify
    </button>
  );
}
