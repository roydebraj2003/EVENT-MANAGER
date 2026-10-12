'use client';

import { useTransition } from 'react';
import { resolveDispute } from '@/app/actions/disputes';
import { RotateCcw, CheckCheck, X, Loader2 } from 'lucide-react';

interface Props {
  disputeId: number;
  status: string;
}

export default function DisputeActionButtons({ disputeId, status }: Props) {
  const [isPending, startTransition] = useTransition();

  if (status !== 'OPEN') {
    return (
      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
        Status: {status}
      </span>
    );
  }

  const handleRefund = () => {
    if (!confirm('Refund advance deposit from escrow back to the host client?')) return;
    startTransition(async () => {
      try {
        await resolveDispute(disputeId, 'REFUND_CLIENT');
      } catch (err: any) {
        alert(err.message || 'Error processing refund');
      }
    });
  };

  const handleRelease = () => {
    if (!confirm('Dismiss host complaint and release escrow payout to the talent provider?')) return;
    startTransition(async () => {
      try {
        await resolveDispute(disputeId, 'RELEASE_FREELANCER');
      } catch (err: any) {
        alert(err.message || 'Error releasing payout');
      }
    });
  };

  const handleClose = () => {
    if (!confirm('Mark dispute closed without financial adjustments?')) return;
    startTransition(async () => {
      try {
        await resolveDispute(disputeId, 'CLOSE');
      } catch (err: any) {
        alert(err.message || 'Error closing dispute');
      }
    });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={handleRefund}
        disabled={isPending}
        className="inline-flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-3 py-1.5 rounded-xl shadow-sm transition disabled:opacity-50"
      >
        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
        Refund Escrow to Host
      </button>

      <button
        onClick={handleRelease}
        disabled={isPending}
        className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3 py-1.5 rounded-xl shadow-sm transition disabled:opacity-50"
      >
        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
        Release to Provider
      </button>

      <button
        onClick={handleClose}
        disabled={isPending}
        className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 font-medium text-xs px-2.5 py-1.5 rounded-xl transition"
      >
        <X className="w-3.5 h-3.5" />
        Dismiss
      </button>
    </div>
  );
}
