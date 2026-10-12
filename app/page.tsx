import Link from 'next/link';
import prisma from '@/lib/prisma';
import HeroSearch from '@/components/HeroSearch';
import ProviderCard, { ProviderData } from '@/components/ProviderCard';
import {
  UtensilsCrossed,
  Sparkles,
  Smile,
  Brush,
  Camera,
  Music,
  Users,
  User,
  ShieldCheck,
  CalendarCheck,
  CreditCard,
  ArrowRight,
  Briefcase,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, any> = {
  'Catering & Food Services': UtensilsCrossed,
  'Decoration & Theme Styling': Sparkles,
  'Makeup, Hair & Styling': Smile,
  'Cleaning & Venue Prep': Brush,
  'Photography & Videography': Camera,
  'Music, DJ & Entertainment': Music,
};

export default async function HomePage() {
  // Fetch top rated providers
  const featuredProviders = await prisma.freelancerProfile.findMany({
    take: 6,
    orderBy: { rating: 'desc' },
    include: {
      user: {
        select: {
          fullName: true,
          location: true,
          profilePicture: true,
        },
      },
      services: {
        take: 3,
        include: {
          category: {
            select: { name: true },
          },
        },
      },
    },
  });

  // Fetch categories with service counts
  const categories = await prisma.category.findMany({
    where: { parentCategoryId: null },
    include: {
      _count: {
        select: { services: true, jobPostings: true },
      },
    },
  });

  // Fetch latest open jobs
  const latestJobs = await prisma.jobPosting.findMany({
    where: { status: 'OPEN' },
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: {
      event: { select: { title: true, city: true, eventDate: true } },
      category: { select: { name: true } },
      _count: { select: { proposals: true } },
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-50/60 via-white to-zinc-50 dark:from-purple-950/20 dark:via-zinc-950 dark:to-zinc-950 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-200/60 dark:border-zinc-800">
        <div className="absolute inset-0 bg-[radial-gradient(#c084fc_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80 shadow-sm animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            Special Occasion Talent Marketplace
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.15]">
            Hire Top Specialists & Crews for{' '}
            <span className="bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Any Special Occasion
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
            Whether you need a solo gourmet chef, a bridal makeup artist, or an entire 8-person catering & cleaning crew—find verified event talent ready for your date.
          </p>

          <div className="pt-4">
            <HeroSearch />
          </div>

          {/* Quick stats / trust chips */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Verified Profiles</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" />
              <span>Solo Talent & Full Teams</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-500" />
              <span>Secure Escrow Protection</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Occasion Categories Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider block mb-1">
              Explore By Specialty
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Popular Occasion Services
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition"
          >
            View all categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.name] || Sparkles;
            return (
              <Link
                key={cat.id}
                href={`/freelancers?category=${encodeURIComponent(cat.name.split('&')[0].trim())}`}
                className="group bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-4 text-center hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 flex flex-col items-center justify-between"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition duration-300 mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-purple-600 transition">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-zinc-400 mt-1 block">
                    {cat._count.services} specialists
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Solo Specialist vs Group Crew Showcase Banner */}
      <section className="bg-zinc-100/70 dark:bg-zinc-900/60 py-16 px-4 sm:px-6 lg:px-8 border-y border-zinc-200/70 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider block mb-1">
              Tailored to Your Occasion Scale
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Need a Solo Specialist or a Complete Crew?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              Our marketplace seamlessly supports both individual independent freelancers and multi-person agencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Solo Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-amber-200/80 dark:border-amber-900/40 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                  <User className="w-5 h-5" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 mb-2">
                  Solo Freelancers
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Individual Specialists
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
                  Perfect for intimate dinner parties, bespoke bridal glamour, boutique floral arches, or personal assistance. Direct communication with your craftsperson.
                </p>
                <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Dedicated 1-on-1 attention
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Transparent hourly rates & packages
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Flexible custom consultations
                  </li>
                </ul>
              </div>
              <Link
                href="/freelancers?providerType=INDIVIDUAL"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition"
              >
                Browse Solo Specialists <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Group Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-indigo-200/80 dark:border-indigo-900/40 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-2">
                  Agencies & Crews
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Full Service Groups & Squads
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
                  Ideal for grand weddings, galas, and corporate occasions. Complete teams of banquet chefs, 5-person venue clean squads, and full bridal parties styling.
                </p>
                <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Multi-person team power (up to 15 members)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Turnkey banquet and venue handling
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Single point of contact & contract
                  </li>
                </ul>
              </div>
              <Link
                href="/freelancers?providerType=GROUP"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition"
              >
                Browse Groups & Crews <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Talent Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider block mb-1">
              Top Rated Providers
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Featured Occasion Talent
            </h2>
          </div>
          <Link
            href="/freelancers"
            className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition"
          >
            Explore all {featuredProviders.length}+ specialists <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProviders.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider as unknown as ProviderData}
            />
          ))}
        </div>
      </section>

      {/* 5. Open Gigs / Jobs Callout */}
      {latestJobs.length > 0 && (
        <section className="py-14 bg-zinc-50 dark:bg-zinc-950 px-4 sm:px-6 lg:px-8 border-t border-zinc-200/80 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider block mb-1">
                  Client Postings
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  Recent Gigs Looking for Talent
                </h2>
              </div>
              <Link
                href="/jobs"
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition"
              >
                Browse all jobs <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-md">
                        {job.category.name}
                      </span>
                      {job.budget && (
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          ${Number(job.budget)} budget
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                      {job.event.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mb-3">
                      {job.event.city || 'Location provided upon booking'} •{' '}
                      {new Date(job.event.eventDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between mt-4">
                    <span className="text-[11px] text-zinc-400">
                      {job._count.proposals} proposals received
                    </span>
                    <Link
                      href="/jobs"
                      className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                    >
                      View & Bid <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. How it works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider block mb-2">
          Simple & Transparent
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-12">
          How OccasionHub Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 font-bold flex items-center justify-center mb-4 text-base">
              1
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Browse or Post an Occasion
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Explore profiles for solo experts or complete crews, or post your event with specific budget targets for catering, decor, and makeup.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 font-bold flex items-center justify-center mb-4 text-base">
              2
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Compare Bids & Packages
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Review customized proposals, inspect portfolios and verified client reviews, chat through messages, and book with one click.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 font-bold flex items-center justify-center mb-4 text-base">
              3
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Flawless Event & Escrow Release
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Your deposit is safely held in escrow until the day is successfully delivered. Release final payment and leave verified feedback.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
