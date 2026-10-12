import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import ProposalActionButtons from '@/components/ProposalActionButtons';
import { addJobPosting } from '@/app/actions/events';
import {
  Calendar,
  MapPin,
  DollarSign,
  Users,
  User,
  Star,
  CheckCircle2,
  Clock,
  Plus,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const eventId = parseInt(id, 10);

  if (isNaN(eventId)) {
    notFound();
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      client: { include: { user: true } },
      jobPostings: {
        include: {
          category: true,
          proposals: {
            include: {
              freelancer: {
                include: { user: true },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      },
      bookings: {
        include: {
          freelancer: { include: { user: true } },
          payments: true,
        },
      },
    },
  });

  if (!event) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    where: { parentCategoryId: null },
    select: { id: true, name: true },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Event Header Banner */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 px-2.5 py-0.5 rounded-full">
                {event.eventType}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                Status: {event.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
              {event.title}
            </h1>
          </div>

          <Link
            href="/events"
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
          >
            ← Back to All Events
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-zinc-500">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Date</span>
            <p className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-500" />
              {new Date(event.eventDate).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Venue</span>
            <p className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
              {event.venue || 'Private Venue'}, {event.city || 'NY'}
            </p>
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Allocated Budget</span>
            <p className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-purple-500" />
              {event.budget ? `$${Number(event.budget)}` : 'Flexible'}
            </p>
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Active Hires</span>
            <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {event.bookings.length} Confirmed
            </p>
          </div>
        </div>
      </div>

      {/* Roles & Job Postings Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Roles Needed & Incoming Talent Bids ({event.jobPostings.length})
          </h2>
        </div>

        {event.jobPostings.map((job) => (
          <div
            key={job.id}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4"
          >
            {/* Job Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-md">
                    {job.category.name}
                  </span>
                  <span className="text-xs text-zinc-400">
                    Status: <strong className="text-zinc-700 dark:text-zinc-300">{job.status}</strong>
                  </span>
                </div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {job.description}
                </p>
              </div>

              {job.budget && (
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Target Budget</span>
                  <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    ${Number(job.budget)}
                  </span>
                </div>
              )}
            </div>

            {/* Received Proposals / Bids */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Received Proposals ({job.proposals.length})
              </h3>

              {job.proposals.length === 0 ? (
                <p className="text-xs text-zinc-400 italic py-2">
                  No proposals submitted for this role yet. Talent from the marketplace can bid on this gig.
                </p>
              ) : (
                <div className="space-y-3">
                  {job.proposals.map((proposal) => {
                    const isGroup = proposal.freelancer.providerType === 'GROUP';
                    return (
                      <div
                        key={proposal.id}
                        className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              proposal.freelancer.user.profilePicture ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                            }
                            alt={proposal.freelancer.user.fullName}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Link
                                href={`/freelancers/${proposal.freelancer.id}`}
                                className="text-sm font-bold text-zinc-900 dark:text-zinc-100 hover:text-purple-600 transition"
                              >
                                {proposal.freelancer.user.fullName}
                              </Link>

                              {isGroup ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                                  <Users className="w-3 h-3 text-indigo-500" />
                                  Group ({proposal.freelancer.teamSize} members)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
                                  <User className="w-3 h-3 text-amber-500" /> Solo
                                </span>
                              )}

                              <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span>{proposal.freelancer.rating}</span>
                              </div>
                            </div>

                            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xl">
                              &ldquo;{proposal.message}&rdquo;
                            </p>
                          </div>
                        </div>

                        {/* Bid Amount & Action */}
                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 sm:gap-2">
                          <div className="text-right">
                            <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Bid Amount</span>
                            <span className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                              ${Number(proposal.bidAmount)}
                            </span>
                          </div>

                          <ProposalActionButtons
                            proposalId={proposal.id}
                            status={proposal.status}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add Another Role Accordion / Form */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-purple-600" /> Add Another Service Role to this Event
          </h3>

          <form action={addJobPosting.bind(null, event.id)} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                Category
              </label>
              <select
                name="categoryId"
                required
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                Target Budget ($)
              </label>
              <input
                type="number"
                name="budget"
                placeholder="e.g. 500"
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                Role Description
              </label>
              <input
                type="text"
                name="description"
                required
                placeholder="e.g. DJ for 4-hour dance set"
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-xs py-2.5 rounded-xl transition shadow-sm"
              >
                Add Role Posting
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
