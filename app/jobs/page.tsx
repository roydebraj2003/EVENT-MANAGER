import prisma from '@/lib/prisma';
import ProposalModal from '@/components/ProposalModal';
import Link from 'next/link';
import { Briefcase, Calendar, MapPin, DollarSign, Sparkles } from 'lucide-react';

interface Props {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function JobsPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const categoryFilter = resolvedParams.category;

  const where: any = { status: 'OPEN' };
  if (categoryFilter) {
    where.category = {
      name: { contains: categoryFilter, mode: 'insensitive' },
    };
  }

  const jobs = await prisma.jobPosting.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      event: {
        include: {
          client: { include: { user: true } },
        },
      },
      category: true,
      _count: { select: { proposals: true } },
    },
  });

  const categories = await prisma.category.findMany({
    where: { parentCategoryId: null },
    select: { id: true, name: true },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      <div>
        <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider block mb-1">
          Occasion Marketplace
        </span>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Open Event Gigs & Opportunities
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Clients are looking for solo specialists and complete crews for upcoming weddings, parties, and corporate events. Submit your bid.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        <Link
          href="/jobs"
          className={`px-3 py-1.5 rounded-full font-semibold transition whitespace-nowrap ${
            !categoryFilter
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200'
          }`}
        >
          All Gigs ({jobs.length})
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/jobs?category=${encodeURIComponent(c.name.split('&')[0].trim())}`}
            className={`px-3 py-1.5 rounded-full font-semibold transition whitespace-nowrap ${
              categoryFilter && c.name.toLowerCase().includes(categoryFilter.toLowerCase())
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200'
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Gigs Grid */}
      {jobs.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-zinc-200 dark:border-zinc-800">
          <Briefcase className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
            No open gigs currently found in this category
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Check back soon or post a new occasion if you are a host!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 px-2.5 py-0.5 rounded-md">
                    {job.category.name}
                  </span>
                  <div className="text-right">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {job.budget ? `$${Number(job.budget)} budget` : 'Flexible budget'}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  {job.event.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-zinc-500 mb-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    {new Date(job.event.eventDate).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    {job.event.city || 'NY Venue'}
                  </span>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  {job.description}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between mt-auto">
                <span className="text-[11px] text-zinc-400">
                  {job._count.proposals} bid(s) placed
                </span>

                <ProposalModal
                  jobId={job.id}
                  jobTitle={job.event.title}
                  categoryName={job.category.name}
                  budget={job.budget}
                  deadline={job.deadline.toISOString()}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
