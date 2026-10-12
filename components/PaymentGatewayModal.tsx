'use client';

import { useState, useTransition } from 'react';
import { formatINR } from '@/lib/currency';
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  X,
  Loader2,
  Building2,
  Smartphone,
  Lock,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalAmount: number;
  depositAmount: number;
  providerName: string;
  onSuccess: (paymentData: {
    transactionId: string;
    paymentMethod: string;
    amountPaid: number;
  }) => Promise<void>;
}

export default function PaymentGatewayModal({
  isOpen,
  onClose,
  title,
  totalAmount,
  depositAmount,
  providerName,
  onSuccess,
}: Props) {
  const [tab, setTab] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [upiMethod, setUpiMethod] = useState<'APPS' | 'QR' | 'VPA'>('APPS');
  const [selectedApp, setSelectedApp] = useState('Google Pay');
  const [vpaId, setVpaId] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txnId, setTxnId] = useState('');
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    const generatedTxnId = `PAY_INR_${tab}_${Math.floor(100000000 + Math.random() * 900000000)}`;

    setTimeout(() => {
      startTransition(async () => {
        try {
          await onSuccess({
            transactionId: generatedTxnId,
            paymentMethod:
              tab === 'UPI'
                ? `UPI (${selectedApp})`
                : tab === 'CARD'
                ? 'Card (RuPay/Visa)'
                : `NetBanking (${selectedBank})`,
            amountPaid: depositAmount,
          });
          setTxnId(generatedTxnId);
          setIsProcessing(false);
          setIsSuccess(true);
          setTimeout(() => {
            onClose();
          }, 2000);
        } catch (err: any) {
          setIsProcessing(false);
          alert(err.message || 'Payment processing failed');
        }
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 relative animate-in fade-in zoom-in-95 duration-200">
        {!isSuccess && !isProcessing && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {isProcessing ? (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="w-14 h-14 text-purple-600 animate-spin mx-auto" />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Processing Secure Payment...
            </h3>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              Connecting with Indian Banking Gateway. Please do not refresh or close this window.
            </p>
          </div>
        ) : isSuccess ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Payment Verified
            </span>
            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
              {formatINR(depositAmount)} Paid via {tab}
            </h3>
            <p className="text-xs text-zinc-500">
              Transaction ID: <span className="font-mono text-zinc-700 dark:text-zinc-300 font-semibold">{txnId}</span>
            </p>
            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/50 text-xs text-emerald-800 dark:text-emerald-200">
              ✓ 30% advance deposit held securely in OccasionHub Escrow.
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Header with Amount */}
            <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                <Lock className="w-3.5 h-3.5" /> 256-Bit Encrypted Indian Gateway
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {title}
                  </h2>
                  <p className="text-xs text-zinc-500">Provider: {providerName}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">30% Advance Escrow</span>
                  <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
                    {formatINR(depositAmount)}
                  </span>
                  <span className="text-[10px] text-zinc-400 block">Total: {formatINR(totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTab('UPI')}
                className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  tab === 'UPI'
                    ? 'bg-white dark:bg-zinc-900 text-purple-600 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                <Smartphone className="w-4 h-4" /> UPI / QR
              </button>
              <button
                type="button"
                onClick={() => setTab('CARD')}
                className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  tab === 'CARD'
                    ? 'bg-white dark:bg-zinc-900 text-purple-600 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                <CreditCard className="w-4 h-4" /> RuPay/Cards
              </button>
              <button
                type="button"
                onClick={() => setTab('NETBANKING')}
                className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  tab === 'NETBANKING'
                    ? 'bg-white dark:bg-zinc-900 text-purple-600 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                <Building2 className="w-4 h-4" /> Net Banking
              </button>
            </div>

            {/* TAB CONTENT: UPI */}
            {tab === 'UPI' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  {(['APPS', 'QR', 'VPA'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setUpiMethod(m)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-xl border transition ${
                        upiMethod === m
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-semibold'
                          : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {m === 'APPS' ? 'UPI Apps' : m === 'QR' ? 'Scan QR' : 'UPI ID / VPA'}
                    </button>
                  ))}
                </div>

                {upiMethod === 'APPS' && (
                  <div className="grid grid-cols-3 gap-2">
                    {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI', 'Cred UPI', 'Amazon Pay'].map((app) => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => setSelectedApp(app)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                          selectedApp === app
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                            : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                        }`}
                      >
                        {app}
                      </button>
                    ))}
                  </div>
                )}

                {upiMethod === 'QR' && (
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl text-center space-y-2">
                    <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl border border-zinc-200 shadow-sm flex items-center justify-center">
                      <QrCode className="w-28 h-28 text-zinc-900" />
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      Scan with any UPI App (GPay, PhonePe, Paytm, BHIM) to pay {formatINR(depositAmount)}
                    </p>
                  </div>
                )}

                {upiMethod === 'VPA' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Enter UPI ID (e.g. mobile@upi, name@okhdfcbank)
                    </label>
                    <input
                      type="text"
                      placeholder="username@upi"
                      value={vpaId}
                      onChange={(e) => setVpaId(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: CARD */}
            {tab === 'CARD' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Card Number (RuPay, Visa, Mastercard)
                  </label>
                  <input
                    type="text"
                    placeholder="4123 •••• •••• 9812"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Valid Thru (MM/YY)
                    </label>
                    <input
                      type="text"
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: NET BANKING */}
            {tab === 'NETBANKING' && (
              <div className="space-y-3">
                <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Select Popular Bank
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition ${
                        selectedBank === bank
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Escrow Guarantee note */}
            <div className="p-3 bg-purple-50/60 dark:bg-purple-950/40 rounded-xl border border-purple-200/60 text-[11px] text-purple-900 dark:text-purple-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span>
                <strong>OccasionHub Escrow Guarantee:</strong> 30% advance deposit is safely held. Remaining 70% ({formatINR(totalAmount - depositAmount)}) will be released only after your event is delivered.
              </span>
            </div>

            {/* Action CTA */}
            <button
              type="button"
              onClick={handlePay}
              disabled={isPending || isProcessing}
              className="w-full bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-semibold text-sm py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Pay {formatINR(depositAmount)} & Confirm Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
