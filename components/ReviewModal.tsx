'use client';

import { useState, useTransition } from 'react';
import { createReview } from '@/app/actions/reviews';
import { Star, X, CheckCircle2 } from 'lucide-react';

interface Props {
  bookingId: number;
  recipientName: string;
}

export default function ReviewModal({ bookingId, recipientName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set('bookingId', bookingId.toString());
    formData.set('rating', rating.toString());
    formData.set('comment', comment);

    startTransition(async () => {
      try {
        await createReview(formData);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setIsOpen(false);
        }, 1500);
      } catch (err: any) {
        alert(err.message || 'Failed to submit review');
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition"
      >
        <Star className="w-3.5 h-3.5 fill-white" />
        Leave Review
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
                  Review Submitted!
                </h3>
                <p className="text-xs text-zinc-500">
                  Thank you for rating your occasion experience with {recipientName}.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Review {recipientName}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Rate the punctuality, communication, and quality of work.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Star Rating Picker */}
                  <div className="flex items-center justify-center gap-2 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(rating)}
                        className="p-1 transition transform hover:scale-110"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= (hoverRating || rating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-zinc-300 dark:text-zinc-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Your Feedback & Comments
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share what you liked most about the service provided..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-sm py-2.5 rounded-xl transition shadow-md disabled:opacity-50"
                  >
                    {isPending ? 'Submitting...' : 'Post Verified Review'}
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
