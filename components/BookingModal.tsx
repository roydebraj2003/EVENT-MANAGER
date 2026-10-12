'use client';

import { useState } from 'react';
import { createDirectBooking } from '@/app/actions/bookings';
import { formatINR } from '@/lib/currency';
import PaymentGatewayModal from '@/components/PaymentGatewayModal';
import { Calendar, X, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface Props {
  freelancerId: number;
  freelancerName: string;
  isGroup: boolean;
  services: Array<{
    id: number;
    price: any;
    description: string;
    category: { name: string };
  }>;
}

export default function BookingModal({ freelancerId, freelancerName, isGroup, services }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id?.toString() || '');
  const [eventDate, setEventDate] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [notes, setNotes] = useState('');

  const selectedService = services.find((s) => s.id.toString() === selectedServiceId);
  const totalAmount = selectedService ? Number(selectedService.price) : 0;
  const depositAmount = totalAmount * 0.3;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate) {
      alert('Please provide an occasion title and date.');
      return;
    }
    // Launch Indian Payment Gateway
    setIsGatewayOpen(true);
  };

  const handlePaymentSuccess = async (paymentData: {
    transactionId: string;
    paymentMethod: string;
    amountPaid: number;
  }) => {
    const formData = new FormData();
    formData.set('freelancerId', freelancerId.toString());
    formData.set('serviceId', selectedServiceId);
    formData.set('eventDate', eventDate);
    formData.set('eventTitle', eventTitle);
    formData.set('notes', notes);
    formData.set('paymentMethod', paymentData.paymentMethod);
    formData.set('transactionId', paymentData.transactionId);

    await createDirectBooking(formData);
    setIsGatewayOpen(false);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition transform active:scale-98"
      >
        <Calendar className="w-4 h-4" />
        {isGroup ? 'Hire Crew with Advance Escrow' : 'Book Specialist (30% Advance)'}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                {isGroup ? 'Group Crew Occasion Booking' : 'Solo Specialist Direct Booking'}
              </span>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                Book {freelancerName}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Select your package and confirm with 30% advance deposit held safely in Escrow.
              </p>
            </div>

            <form onSubmit={handleProceedToPayment} className="space-y-4">
              {/* Service selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Select Package / Service
                </label>
                <select
                  name="serviceId"
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  required
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.category.name}: {s.description.slice(0, 45)}... ({formatINR(s.price)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Price display badge in INR */}
              {selectedService && (
                <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-xl p-3.5 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600 dark:text-zinc-400">Total Package Amount:</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{formatINR(totalAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-purple-200/50">
                    <span className="text-purple-800 dark:text-purple-300 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> 30% Advance Escrow Deposit:
                    </span>
                    <span className="text-base font-extrabold text-purple-900 dark:text-purple-100">
                      {formatINR(depositAmount)}
                    </span>
                  </div>
                </div>
              )}

              {/* Event Title */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Occasion / Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mehendi & Sangeet Evening"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Occasion Date *
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Special Preferences or Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="Guest count, timing, Jain meal options, traditional theme details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-semibold text-xs py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2"
                >
                  Proceed to Payment ({formatINR(depositAmount)})
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Indian Payment Gateway Modal */}
      <PaymentGatewayModal
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
        title={eventTitle || 'Occasion Package'}
        totalAmount={totalAmount}
        depositAmount={depositAmount}
        providerName={freelancerName}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}
