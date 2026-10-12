import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import BookingModal from '@/components/BookingModal';
import {
  Star,
  MapPin,
  Users,
  User,
  CheckCircle2,
  Award,
  GraduationCap,
  Calendar,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function FreelancerProfilePage({ params }: Props) {
  const { id } = await params;
  const providerId = parseInt(id, 10);

  if (isNaN(providerId)) {
    notFound();
  }

  const provider = await prisma.freelancerProfile.findUnique({
    where: { id: providerId },
    include: {
      user: {
        include: {
          reviewsReceived: {
            where: { reviewType: 'CLIENT_TO_FREELANCER' },
            include: {
              reviewer: {
                select: { fullName: true, profilePicture: true },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      },
      services: {
        include: { category: true },
      },
      portfolioItems: true,
      certifications: true,
      education: true,
      availability: true,
    },
  });

  if (!provider) {
    notFound();
  }

  const isGroup = provider.providerType === 'GROUP';
  const hourlyRate = provider.hourlyRate ? Number(provider.hourlyRate) : null;

  return (
    <div className="min-h-screen bg-zinc-50/60 dark:bg-zinc-950 pb-20">
      {/* Banner */}
      <div className="h-48 sm:h-64 bg-gradient-to-r from-purple-900 via-indigo-900 to-zinc-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-28 relative z-10">
        {/* Profile Card Header */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-zinc-200/80 dark:border-zinc-800 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    provider.user.profilePicture ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
                  }
                  alt={provider.user.fullName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white dark:border-zinc-900 shadow-md"
                />
                {provider.isVerified && (
                  <span
                    className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 rounded-full p-1 shadow-sm"
                    title="Verified Talent"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  {isGroup ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                      <Users className="w-3.5 h-3.5 text-indigo-500" />
                      Group Agency • {provider.teamSize || 1} Crew Members
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800">
                      <User className="w-3.5 h-3.5 text-amber-500" />
                      Solo Specialist
                    </span>
                  )}

                  <div className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>{provider.rating > 0 ? provider.rating.toFixed(1) : 'New'}</span>
                    <span className="text-xs text-zinc-400 font-normal">
                      ({provider.totalReviews} reviews)
                    </span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {provider.user.fullName}
                </h1>

                {provider.user.location && (
                  <p className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    {provider.user.location}
                  </p>
                )}
              </div>
            </div>

            {/* CTA action */}
            <div className="w-full sm:w-auto flex flex-col sm:items-end gap-3">
              {hourlyRate && (
                <div className="text-right">
                  <span className="text-[11px] text-zinc-400 font-medium block">Starting rate</span>
                  <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    ${hourlyRate} <span className="text-xs text-zinc-400 font-normal">/ hr</span>
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <BookingModal
                  freelancerId={provider.id}
                  freelancerName={provider.user.fullName}
                  isGroup={isGroup}
                  services={provider.services}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs / Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Main Info: Bio, Services, Portfolio */}
          <div className="lg:col-span-2 space-y-8">
            {/* About / Bio */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                {isGroup ? 'About the Crew & Capacity' : 'About the Specialist'}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {provider.bio || 'Experienced event professional dedicated to excellence for every special occasion.'}
              </p>
              {isGroup && (
                <div className="mt-4 p-3 bg-indigo-50/50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span>
                    This provider operates as a coordinated team of <strong>{provider.teamSize || 1} specialists</strong> with shared equipment, banquet captains, and backup attendants.
                  </span>
                </div>
              )}
            </div>

            {/* Services & Packages List */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Offered Services & Packages ({provider.services.length})
                </h2>
              </div>

              <div className="space-y-4">
                {provider.services.map((service) => (
                  <div
                    key={service.id}
                    className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 hover:border-purple-300 dark:hover:border-purple-700 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-50/40 dark:bg-zinc-900/40"
                  >
                    <div>
                      <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md">
                        {service.category.name}
                      </span>
                      <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 font-medium mt-1.5 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="flex-shrink-0 text-right sm:pl-4">
                      <span className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 block">
                        ${Number(service.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio Showcase */}
            {provider.portfolioItems.length > 0 && (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                  Past Occasions & Portfolio ({provider.portfolioItems.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {provider.portfolioItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 group"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="p-3">
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Client Reviews Section */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                Verified Client Reviews ({provider.user.reviewsReceived.length})
              </h2>

              {provider.user.reviewsReceived.length === 0 ? (
                <p className="text-xs text-zinc-400 italic">
                  No client reviews received yet. Be the first to book!
                </p>
              ) : (
                <div className="space-y-4">
                  {provider.user.reviewsReceived.map((r) => (
                    <div
                      key={r.id}
                      className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              r.reviewer.profilePicture ||
                              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80'
                            }
                            alt={r.reviewer.fullName}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                            {r.reviewer.fullName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{r.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {r.comment}
                      </p>
                      <span className="text-[10px] text-zinc-400 mt-2 block">
                        {new Date(r.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Credentials, Experience, Escrow Protection */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Talent Overview
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-500">Provider Structure</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {isGroup ? `Group (${provider.teamSize} members)` : 'Solo Specialist'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-500">Industry Experience</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {provider.experienceYears || 5}+ Years
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-500">Verification</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Identity Verified
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-zinc-500">Average Rating</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {provider.rating > 0 ? `${provider.rating} / 5.0` : 'New'}
                  </span>
                </div>
              </div>
            </div>

            {/* Certifications & Education */}
            {(provider.certifications.length > 0 || provider.education.length > 0) && (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Credentials & Education
                </h3>

                {provider.certifications.map((c) => (
                  <div key={c.id} className="flex items-start gap-2.5 text-xs">
                    <Award className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-zinc-800 dark:text-zinc-200">{c.title}</p>
                      <p className="text-[11px] text-zinc-500">{c.issuingOrganization} ({c.issuedYear})</p>
                    </div>
                  </div>
                ))}

                {provider.education.map((e) => (
                  <div key={e.id} className="flex items-start gap-2.5 text-xs">
                    <GraduationCap className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-zinc-800 dark:text-zinc-200">{e.degreeName}</p>
                      <p className="text-[11px] text-zinc-500">{e.institutionName}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
