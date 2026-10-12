import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { Calendar, Plus, MapPin, DollarSign, Clock, ArrowRight } from 'lucide-react';

export default async function EventsPage() {
  const user = await getCurrentUser();

  const events = user?.clientProfile
    ? await prisma.event.findMany({
        where: { clientId: user.clientProfile.id },
        include: {
          jobPostings: {
            include: {
              category: true,
              _count: { select: { proposals: true } },
            },
          },
          bookings: {
            include: {
              freelancer: { include: { user: true } },
            },
          },
        },
        orderBy: { eventDate: 'desc' },
      })
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider block mb-1">
            Host Event Center
          </span>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            My Events & Occasions
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage your celebration timeline, review talent proposals, and track bookings.
          </p>
        </div>

        <Link
          href="/events/new"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          Plan New Occasion
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-zinc-200 dark:border-zinc-800">
          <Calendar className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
            No events scheduled yet
          </h3>
          <p className="text-xs text-zinc-500 mt-1 mb-6 max-w-sm mx-auto">
            Create your first occasion to start receiving bids from catering crews, decorators, and makeup artists.
          </p>
          <Link
            href="/events/new"
            className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold px-4 py-2 rounded-xl"
          >
            <Plus className="w-3.5 h-3.5" /> Plan an Occasion
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event) => {
            const totalProposals = event.jobPostings.reduce(
              (acc, j) => acc + j._count.proposals,
              0
            );

            return (
              <div
                key={event.id}
                className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 px-2.5 py-0.5 rounded-full">
                        {event.eventType}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          event.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                      {event.title}
                    </h2>
                  </div>

                  <Link
                    href={`/events/${event.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-purple-600 transition"
                  >
                    View Details & Bids <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-zinc-500 mb-4">
                  <div>
                    <span className="block text-[10px] text-zinc-400 uppercase font-semibold">Date</span>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                      {new Date(event.eventDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="block text-[10px] text-zinc-400 uppercase font-semibold">Venue</span>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 truncate">
                      {event.venue || 'Private Venue'}, {event.city || 'TBD'}
                    </p>
                  </div>
                  <div>
                    <span className="block text-[10px] text-zinc-400 uppercase font-semibold">Budget</span>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                      {event.budget ? `$${Number(event.budget)}` : 'Flexible'}
                    </p>
                  </div>
                  <div>
                    <span className="block text-[10px] text-zinc-400 uppercase font-semibold">Proposals</span>
                    <p className="font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
                      {totalProposals} talent bids received
                    </p>
                  </div>
                </div>

                {/* Job Postings tags */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-zinc-400 font-medium">Roles needed:</span>
                    {event.jobPostings.map((job) => (
                      <span
                        key={job.id}
                        className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-md font-medium text-[11px]"
                      >
                        {job.category.name} ({job._count.proposals} bids)
                      </span>
                    ))}
                  </div>
                  {event.bookings.length > 0 && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ {event.bookings.length} confirmed hire(s)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
