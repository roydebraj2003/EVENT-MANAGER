import prisma from '@/lib/prisma';
import ReviewDeleteButton from '@/components/ReviewDeleteButton';
import { Star, MessageSquareQuote } from 'lucide-react';

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: {
      reviewer: true,
      reviewee: true,
      booking: { include: { event: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider block mb-1">
          Quality & Feedback Moderation
        </span>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Review & Rating Management
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Monitor feedback submitted across occasion bookings, moderate spam, and ensure authentic ratings.
        </p>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-zinc-200 dark:border-zinc-800">
            <p className="text-xs text-zinc-500">No reviews have been posted yet.</p>
          </div>
        ) : (
          reviews.map((r) => (
            <div
              key={r.id}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{r.rating}.0 Rating</span>
                  </div>
                  <span className="text-xs text-zinc-500">
                    For Booking #{r.bookingId}: <strong>{r.booking.event.title}</strong>
                  </span>
                </div>

                <ReviewDeleteButton reviewId={r.id} />
              </div>

              <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                &ldquo;{r.comment}&rdquo;
              </p>

              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                <span>
                  Author: <strong className="text-zinc-700 dark:text-zinc-300">{r.reviewer.fullName}</strong> → Recipient: <strong className="text-zinc-700 dark:text-zinc-300">{r.reviewee.fullName}</strong>
                </span>
                <span>{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
