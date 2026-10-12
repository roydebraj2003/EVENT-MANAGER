import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import BookingActionButtons from '@/components/BookingActionButtons';
import ReviewModal from '@/components/ReviewModal';
import Link from 'next/link';
import {
  CalendarCheck,
  Calendar,
  Users,
  User,
  DollarSign,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default async function BookingsPage() {
  const user = await getCurrentUser();

  const whereClause: any = {};
  if (user?.clientProfile && user?.freelancerProfile) {
    whereClause.OR = [
      { clientId: user.clientProfile.id },
      { freelancerId: user.freelancerProfile.id },
    ];
  } else if (user?.clientProfile) {
    whereClause.clientId = user.clientProfile.id;
  } else if (user?.freelancerProfile) {
    whereClause.freelancerId = user.freelancerProfile.id;
  }

  const bookings = user
    ? await prisma.booking.findMany({
        where: whereClause,
        include: {
          event: true,
          freelancer: {
            include: { user: true },
          },
          client: {
            include: { user: true },
          },
          payments: true,
          reviews: true,
          proposal: {
            include: { conversation: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      <div>
        <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider block mb-1">
          Occasion Order Management
        </span>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Event Bookings & Contracts
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Track confirmed hires, release escrow payments upon event conclusion, and exchange verified reviews.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-zinc-200 dark:border-zinc-800">
          <CalendarCheck className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
            No bookings recorded yet
          </h3>
          <p className="text-xs text-zinc-500 mt-1 mb-6 max-w-sm mx-auto">
            Book an occasion specialist directly from their profile or accept a proposal on one of your events.
          </p>
          <Link
            href="/freelancers"
            className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold px-4 py-2 rounded-xl"
          >
            Find Talent to Book
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const isClientViewer = user?.id === booking.client.user.id;
            const otherParty = isClientViewer
              ? booking.freelancer.user
              : booking.client.user;
            const isGroup = booking.freelancer.providerType === 'GROUP';
            const hasReview = booking.reviews.some((r) => r.reviewerId === user?.id);

            return (
              <div
                key={booking.id}
                className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 font-bold text-sm">
                      #{booking.id}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            booking.status === 'CONFIRMED'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/60'
                              : booking.status === 'COMPLETED'
                              ? 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200/60'
                              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800'
                          }`}
                        >
                          {booking.status}
                        </span>
                        <span className="text-xs text-zinc-400">
                          Occasion: {new Date(booking.event.eventDate).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                        {booking.event.title}
                      </h3>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Total Contract</span>
                    <span className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
                      ${Number(booking.totalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Counterpart info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        otherParty.profilePicture ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                      }
                      alt={otherParty.fullName}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
                        {isClientViewer ? 'Hired Talent' : 'Host / Client'}
                      </span>
                      <p className="font-bold text-zinc-800 dark:text-zinc-200">
                        {otherParty.fullName}
                      </p>
                      {isClientViewer && (
                        <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                          {isGroup ? (
                            <>
                              <Users className="w-3 h-3 text-indigo-500" />
                              Group Crew ({booking.freelancer.teamSize} members)
                            </>
                          ) : (
                            <>
                              <User className="w-3 h-3 text-amber-500" /> Solo Specialist
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Payment Escrow Details */}
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
                      Escrow Payments ({booking.payments.length})
                    </span>
                    <div className="space-y-1 mt-1">
                      {booking.payments.map((p) => (
                        <div key={p.id} className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-500 font-medium">
                            {p.paymentType}: ${Number(p.amount)}
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" /> {p.paymentStatus}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Venue info */}
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
                      Venue Location
                    </span>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200 mt-1">
                      {booking.event.venue || 'Private Hall'}
                    </p>
                    <p className="text-zinc-500">{booking.event.city || 'NY'}</p>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href="/messages"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                      Chat with {otherParty.fullName.split(' ')[0]}
                    </Link>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status actions */}
                    <BookingActionButtons
                      bookingId={booking.id}
                      status={booking.status}
                    />

                    {/* Review action for completed bookings */}
                    {booking.status === 'COMPLETED' && !hasReview && (
                      <ReviewModal
                        bookingId={booking.id}
                        recipientName={otherParty.fullName}
                      />
                    )}

                    {hasReview && (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Reviewed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
