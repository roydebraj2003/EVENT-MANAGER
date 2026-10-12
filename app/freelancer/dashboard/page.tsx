import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { updateFreelancerProfile, addFreelancerService } from '@/app/actions/profile';
import Link from 'next/link';
import {
  Users,
  User,
  Star,
  DollarSign,
  Plus,
  Briefcase,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default async function FreelancerDashboardPage() {
  const user = await getCurrentUser();

  if (!user || !user.freelancerProfile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Provider Profile Required
        </h2>
        <p className="text-xs text-zinc-500 mb-6">
          Use the persona switcher in the top right to view as a Solo Specialist or Group Provider.
        </p>
      </div>
    );
  }

  const profile = await prisma.freelancerProfile.findUnique({
    where: { id: user.freelancerProfile.id },
    include: {
      services: { include: { category: true } },
      proposals: {
        include: {
          job: { include: { event: true, category: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
      bookings: {
        include: { event: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  const categories = await prisma.category.findMany({
    where: { parentCategoryId: null },
    select: { id: true, name: true },
  });

  if (!profile) return null;

  const isGroup = profile.providerType === 'GROUP';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider block mb-1">
            Talent & Agency Management
          </span>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Provider Dashboard
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage your individual specialist or group crew settings, services, rates, and active occasion bids.
          </p>
        </div>

        <Link
          href={`/freelancers/${profile.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
        >
          View Public Profile <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Structure</span>
          <div className="flex items-center gap-2 mt-1">
            {isGroup ? (
              <Users className="w-4 h-4 text-indigo-500" />
            ) : (
              <User className="w-4 h-4 text-amber-500" />
            )}
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {isGroup ? `Group (${profile.teamSize} members)` : 'Solo Specialist'}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Rating</span>
          <div className="flex items-center gap-1.5 mt-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {profile.rating > 0 ? profile.rating.toFixed(1) : 'New'}
            </span>
            <span className="text-xs text-zinc-400 font-normal">
              ({profile.totalReviews} reviews)
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Active Bookings</span>
          <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {profile.bookings.length} Events Booked
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Starting Hourly</span>
          <p className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            ${profile.hourlyRate ? Number(profile.hourlyRate) : 50}/hr
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Profile Settings (Individual vs Group) */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            Provider Profile & Team Structure
          </h2>

          <form action={updateFreelancerProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Display Name or Crew / Agency Name
              </label>
              <input
                type="text"
                name="fullName"
                defaultValue={user.fullName}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Provider Structure Type *
                </label>
                <select
                  name="providerType"
                  defaultValue={profile.providerType}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="INDIVIDUAL">Solo Specialist (Individual)</option>
                  <option value="GROUP">Group / Crew / Agency (Team)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Crew / Team Size (Members)
                </label>
                <input
                  type="number"
                  name="teamSize"
                  min="1"
                  max="50"
                  defaultValue={profile.teamSize || 1}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Starting Hourly Rate ($)
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  step="5"
                  defaultValue={profile.hourlyRate ? Number(profile.hourlyRate) : 65}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Location / Base City
                </label>
                <input
                  type="text"
                  name="location"
                  defaultValue={user.location || 'New York, NY'}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Bio & Equipment / Crew Capacity
              </label>
              <textarea
                name="bio"
                rows={3}
                defaultValue={profile.bio || ''}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-xs py-2.5 rounded-xl transition"
            >
              Save Profile Settings
            </button>
          </form>
        </div>

        {/* Services & Fixed Packages */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            My Services & Packages ({profile.services.length})
          </h2>

          <div className="space-y-3">
            {profile.services.map((s) => (
              <div
                key={s.id}
                className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded text-[10px]">
                    {s.category.name}
                  </span>
                  <p className="font-medium text-zinc-800 dark:text-zinc-200 mt-1">
                    {s.description}
                  </p>
                </div>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 ml-3">
                  ${Number(s.price)}
                </span>
              </div>
            ))}
          </div>

          {/* Add Service Package Form */}
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Add New Service Package
            </h3>
            <form action={addFreelancerService} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    Package Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    placeholder="e.g. 450"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Package Description
                </label>
                <input
                  type="text"
                  name="description"
                  required
                  placeholder="e.g. 5-Hour Event Reception Banquet service"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-2 rounded-xl transition shadow-sm"
              >
                Add Service Package
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Submitted Proposals Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-purple-600" />
          My Submitted Occasion Bids ({profile.proposals.length})
        </h2>

        {profile.proposals.length === 0 ? (
          <p className="text-xs text-zinc-400 italic">
            You haven’t bid on any gigs yet. Browse open gigs to submit bids!
          </p>
        ) : (
          <div className="space-y-3">
            {profile.proposals.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded text-[10px]">
                      {p.job.category.name}
                    </span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                        p.status === 'ACCEPTED'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : p.status === 'REJECTED'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
                    {p.job.event.title}
                  </h4>
                  <p className="text-zinc-500 mt-0.5 italic">&ldquo;{p.message}&rdquo;</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Bid Placed</span>
                  <span className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                    ${Number(p.bidAmount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
