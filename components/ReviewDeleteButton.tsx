'use client';

import { useTransition } from 'react';
import { deleteReview } from '@/app/actions/admin';
import { Trash2, Loader2 } from 'lucide-react';

interface Props {
  reviewId: number;
}

export default function ReviewDeleteButton({ reviewId }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm('Are you sure you want to permanently delete this review? Ratings will be recalculated.')) return;
    startTransition(async () => {
      try {
        await deleteReview(reviewId);
      } catch (err: any) {
        alert(err.message || 'Error deleting review');
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 font-semibold transition disabled:opacity-50"
    >
      {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
      Delete Review
    </button>
  );
}
