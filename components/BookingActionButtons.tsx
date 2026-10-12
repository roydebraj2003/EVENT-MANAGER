'use client';

import { useTransition } from 'react';
import { updateBookingStatus } from '@/app/actions/bookings';
import { CheckCheck, X, Loader2 } from 'lucide-react';

interface Props {
  bookingId: number;
  status: string;
}

export default function BookingActionButtons({ bookingId, status }: Props) {
  const [isPending, startTransition] = useTransition();

  if (status !== 'CONFIRMED') return null;

  const handleComplete = () => {
    if (!confirm('Mark this event booking as successfully delivered and release remaining payment?')) return;
    startTransition(async () => {
      try {
        await updateBookingStatus(bookingId, 'COMPLETED');
      } catch (err: any) {
        alert(err.message || 'Error updating status');
      }
    });
  };

  const handleCancel = () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    startTransition(async () => {
      try {
        await updateBookingStatus(bookingId, 'CANCELLED');
      } catch (err: any) {
        alert(err.message || 'Error cancelling booking');
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleComplete}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition disabled:opacity-50"
      >
        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
        Mark Completed & Release
      </button>

      <button
        onClick={handleCancel}
        disabled={isPending}
        className="inline-flex items-center gap-1 text-zinc-500 hover:text-rose-600 font-medium text-xs px-2.5 py-1.5 rounded-lg transition"
      >
        <X className="w-3.5 h-3.5" />
        Cancel
      </button>
    </div>
  );
}
