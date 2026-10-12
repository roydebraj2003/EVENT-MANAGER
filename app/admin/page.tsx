import prisma from '@/lib/prisma';
import { formatINR } from '@/lib/currency';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Users,
  User,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default async function AdminOverviewPage() {
  // Aggregate GMV and Bookings
  const allBookings = await prisma.booking.findMany({
    include: {
      payments: true,
      event: true,
      freelancer: { include: { user: true } },
    },
  });

  const totalGMV = allBookings.reduce((acc, b) => acc + Number(b.totalAmount), 0);
  const platformRevenue = totalGMV * 0.10; // 10% SaaS commission fee

  // Total payments collected
  const allPayments = await prisma.payment.findMany();
  const totalEscrowCollected = allPayments
    .filter((p) => p.paymentStatus === 'COMPLETED')
    .reduce((acc, p) => acc + Number(p.amount), 0);

  // Disputes & complaints
  const openDisputes = await prisma.dispute.findMany({
    where: { status: 'OPEN' },
    include: {
      raisedBy: true,
      booking: { include: { event: true } },
    },
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  // Verification pipeline
  const unverifiedProviders = await prisma.freelancerProfile.findMany({
    where: { isVerified: false },
    include: { user: true, services: { include: { category: true } } },
    take: 5,
  });

  // Providers structure stats
  const totalSolo = await prisma.freelancerProfile.count({
    where: { providerType: 'INDIVIDUAL' },
  });
  const totalGroups = await prisma.freelancerProfile.count({
    where: { providerType: 'GROUP' },
  });
  const totalClients = await prisma.clientProfile.count();
  const totalEvents = await prisma.event.count();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider block mb-1">
          Operations & Financials
        </span>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
          SaaS Platform Analytics
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          High-level metrics across Indian marketplace transactions, escrow deposits, complaints, and talent verifications.
        </p>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GMV */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
            Gross Merchandise Value (GMV)
          </span>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-1">
            {formatINR(totalGMV)}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Across {allBookings.length} bookings
          </span>
        </div>

        {/* Platform Revenue */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
            Platform Take (10% Fee)
          </span>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {formatINR(platformRevenue)}
          </p>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            Commission revenue earned
          </span>
        </div>

        {/* Escrow Processed */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
            Total Escrow Processed
          </span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {formatINR(totalEscrowCollected)}
          </p>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            Via UPI, Cards & NetBanking
          </span>
        </div>

        {/* Open Complaints */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
            Pending Disputes
          </span>
          <p className={`text-2xl font-black mt-1 ${openDisputes.length > 0 ? 'text-rose-600' : 'text-zinc-900'}`}>
            {openDisputes.length} Open
          </p>
          <Link
            href="/admin/disputes"
            className="text-[11px] text-purple-600 hover:text-purple-700 font-semibold mt-1 flex items-center gap-1"
          >
            Review complaints <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Marketplace Breakdown Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
            <User className="w-4 h-4" />
          </div>
          <div>
            <span className="text-zinc-400 text-[10px] uppercase font-semibold block">Solo Specialists</span>
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{totalSolo} registered</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-zinc-400 text-[10px] uppercase font-semibold block">Groups & Agencies</span>
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{totalGroups} teams</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-zinc-400 text-[10px] uppercase font-semibold block">Total Occasions</span>
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{totalEvents} events posted</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-zinc-400 text-[10px] uppercase font-semibold block">Host Clients</span>
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{totalClients} registered</p>
          </div>
        </div>
      </div>

      {/* Action Queues: Disputes & Verifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Disputes */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Complaints Awaiting Action ({openDisputes.length})
            </h2>
            <Link
              href="/admin/disputes"
              className="text-xs font-semibold text-purple-600 hover:text-purple-700"
            >
              View all
            </Link>
          </div>

          {openDisputes.length === 0 ? (
            <p className="text-xs text-zinc-400 italic py-4 text-center">
              No open complaints! All bookings running smoothly.
            </p>
          ) : (
            <div className="space-y-3">
              {openDisputes.map((d) => (
                <div
                  key={d.id}
                  className="p-3.5 rounded-2xl border border-rose-100 dark:border-rose-950/60 bg-rose-50/30 dark:bg-rose-950/20 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      Booking #{d.bookingId}: {d.booking.event.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-semibold text-[10px]">
                      Open
                    </span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-300 line-clamp-2">
                    &ldquo;{d.reason}&rdquo;
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-zinc-400">
                      Filed by: {d.raisedBy.fullName}
                    </span>
                    <Link
                      href="/admin/disputes"
                      className="text-xs font-bold text-purple-600 hover:underline"
                    >
                      Resolve Dispute →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Verifications */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Talent Verification Queue ({unverifiedProviders.length})
            </h2>
            <Link
              href="/admin/verifications"
              className="text-xs font-semibold text-purple-600 hover:text-purple-700"
            >
              View all
            </Link>
          </div>

          {unverifiedProviders.length === 0 ? (
            <p className="text-xs text-zinc-400 italic py-4 text-center">
              All registered talent profiles have been verified.
            </p>
          ) : (
            <div className="space-y-3">
              {unverifiedProviders.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.user.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                      alt={p.user.fullName}
                      className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {p.user.fullName}
                      </p>
                      <span className="text-[10px] text-zinc-400">
                        {p.providerType === 'GROUP' ? `Group (${p.teamSize} members)` : 'Solo Specialist'} • {p.user.location}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/admin/verifications"
                    className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm"
                  >
                    Review Profile
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
