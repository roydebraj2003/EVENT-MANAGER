'use client';

import { useState, useTransition } from 'react';
import { createDispute } from '@/app/actions/disputes';
import { AlertTriangle, X, CheckCircle2, Loader2 } from 'lucide-react';

interface Props {
  bookingId: number;
  eventTitle: string;
}

export default function DisputeModal({ bookingId, eventTitle }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set('bookingId', bookingId.toString());
    formData.set('reason', reason);

    startTransition(async () => {
      try {
        await createDispute(formData);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setIsOpen(false);
        }, 1800);
      } catch (err: any) {
        alert(err.message || 'Error filing complaint');
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 text-zinc-400 hover:text-rose-500 text-xs font-medium px-2 py-1 rounded transition"
      >
        <AlertTriangle className="w-3.5 h-3.5" />
        Report Issue / Dispute
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {isSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Dispute Filed Successfully
                </h3>
                <p className="text-xs text-zinc-500">
                  Platform admin team has been notified and will review the contract and escrow status.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center mb-2">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    File a Complaint / Dispute
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    For booking: <strong className="text-zinc-800 dark:text-zinc-200">{eventTitle}</strong> (#{bookingId})
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Issue Description & Evidence
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Detail what went wrong: delay, unfulfilled service scope, unresponsiveness, quality concerns..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                    />
                  </div>

                  <p className="text-[11px] text-zinc-500">
                    * Filing a dispute places remaining escrow payments on temporary administrative hold while our team investigates.
                  </p>

                  <button
                    type="submit"
                    disabled={isPending || !reason.trim()}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs py-2.5 rounded-xl transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...
                      </>
                    ) : (
                      'Submit Dispute to Admin'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
