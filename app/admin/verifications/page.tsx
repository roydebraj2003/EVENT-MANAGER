import prisma from '@/lib/prisma';
import VerificationActionButtons from '@/components/VerificationActionButtons';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, Users, User, Star, Award, ArrowRight } from 'lucide-react';

export default async function AdminVerificationsPage() {
  const providers = await prisma.freelancerProfile.findMany({
    include: {
      user: true,
      services: { include: { category: true } },
      certifications: true,
      portfolioItems: true,
    },
    orderBy: [{ isVerified: 'asc' }, { rating: 'desc' }],
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider block mb-1">
          Trust & Safety
        </span>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Talent Verification & Approvals
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Review talent credentials, crew structure, past portfolios, and approve the verified badge for individual specialists and agencies.
        </p>
      </div>

      <div className="space-y-4">
        {providers.map((p) => {
          const isGroup = p.providerType === 'GROUP';
          return (
            <div
              key={p.id}
              className={`bg-white dark:bg-zinc-900 rounded-3xl p-6 border shadow-sm space-y-4 ${
                !p.isVerified
                  ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/10'
                  : 'border-zinc-200/80 dark:border-zinc-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.user.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={p.user.fullName}
                    className="w-12 h-12 rounded-2xl object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                        {p.user.fullName}
                      </h3>
                      {isGroup ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                          <Users className="w-3 h-3 text-indigo-500" />
                          Group Crew ({p.teamSize} members)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
                          <User className="w-3 h-3 text-amber-500" /> Solo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500">
                      {p.user.email} • {p.user.location || 'India'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/freelancers/${p.id}`}
                    target="_blank"
                    className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                  >
                    View Public Profile <ArrowRight className="w-3 h-3" />
                  </Link>
                  <VerificationActionButtons
                    freelancerId={p.id}
                    isVerified={p.isVerified}
                  />
                </div>
              </div>

              {/* Bio & Details */}
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {p.bio || 'No bio provided.'}
              </p>

              {/* Badges / Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Rating</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {p.rating} ({p.totalReviews} reviews)
                  </span>
                </div>
                <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Experience</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200 mt-0.5 block">
                    {p.experienceYears || 1}+ Years
                  </span>
                </div>
                <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Services</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200 mt-0.5 block">
                    {p.services.length} Listed
                  </span>
                </div>
                <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Portfolio</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200 mt-0.5 block">
                    {p.portfolioItems.length} Uploaded
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
