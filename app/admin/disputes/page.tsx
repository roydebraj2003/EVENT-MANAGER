import prisma from '@/lib/prisma';
import { formatINR } from '@/lib/currency';
import DisputeActionButtons from '@/components/DisputeActionButtons';
import { AlertTriangle, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

export default async function AdminDisputesPage() {
  const disputes = await prisma.dispute.findMany({
    include: {
      raisedBy: true,
      booking: {
        include: {
          event: true,
          freelancer: { include: { user: true } },
          client: { include: { user: true } },
          payments: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider block mb-1">
          Escrow Protection & Mediation
        </span>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Complaints & Dispute Resolution
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Review host and talent complaints, examine contract specifications, and authorize escrow refunds or payouts.
        </p>
      </div>

      {disputes.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-zinc-200 dark:border-zinc-800">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            No complaints or disputes found
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            All marketplace bookings are operating cleanly.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {disputes.map((dispute) => {
            const isClientRaised = dispute.raisedById === dispute.booking.client.user.id;
            const depositPayment = dispute.booking.payments.find(p => p.paymentType === 'DEPOSIT');

            return (
              <div
                key={dispute.id}
                className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold text-xs">
                      #{dispute.id}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                            dispute.status === 'OPEN'
                              ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300'
                              : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          {dispute.status}
                        </span>
                        <span className="text-xs text-zinc-400">
                          Filed on {new Date(dispute.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                        Booking #{dispute.bookingId}: {dispute.booking.event.title}
                      </h3>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Total Value</span>
                    <span className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                      {formatINR(dispute.booking.totalAmount)}
                    </span>
                    {depositPayment && (
                      <span className="text-[10px] text-purple-600 block">
                        Escrow: {formatINR(depositPayment.amount)} ({depositPayment.paymentStatus})
                      </span>
                    )}
                  </div>
                </div>

                {/* Complaint Reason */}
                <div className="p-4 bg-rose-50/40 dark:bg-rose-950/20 rounded-2xl border border-rose-100 dark:border-rose-900/40 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 block mb-1">
                    Complaint Reason (Filed by {dispute.raisedBy.fullName}):
                  </span>
                  <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                    &ldquo;{dispute.reason}&rdquo;
                  </p>
                </div>

                {/* Parties Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Host Client</span>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                      {dispute.booking.client.user.fullName}
                    </p>
                    <p className="text-zinc-500 text-[11px]">{dispute.booking.client.user.email}</p>
                  </div>

                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Talent Provider</span>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                      {dispute.booking.freelancer.user.fullName}
                    </p>
                    <p className="text-zinc-500 text-[11px]">
                      {dispute.booking.freelancer.providerType === 'GROUP'
                        ? `Group Crew (${dispute.booking.freelancer.teamSize} members)`
                        : 'Solo Specialist'} • {dispute.booking.freelancer.user.email}
                    </p>
                  </div>
                </div>

                {/* Administrative Resolution Controls */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between flex-wrap gap-3">
                  <div className="text-xs text-zinc-400">
                    {dispute.resolvedAt && (
                      <span>Resolved on {new Date(dispute.resolvedAt).toLocaleDateString()}</span>
                    )}
                  </div>

                  <DisputeActionButtons
                    disputeId={dispute.id}
                    status={dispute.status}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
