import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Laptop,
  Flame,
  Award,
} from 'lucide-react';
import { CONSULTATION_PACKAGES, ServicePackage } from './PaymentModal';
import { useAuth } from '../firebase/context';
import { fetchRecentPayments, PaymentRecord } from '../services/paymentService';

interface PaymentSectionProps {
  onOpenPaymentModal: (packageId?: string) => void;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({ onOpenPaymentModal }) => {
  const { isAdmin } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [showAdminTab, setShowAdminTab] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      setLoadingTransactions(true);
      fetchRecentPayments()
        .then((records) => {
          setPayments(records);
          setLoadingTransactions(false);
        })
        .catch((err) => {
          console.warn('Failed to load payments for admin:', err);
          setLoadingTransactions(false);
        });
    }
  }, [isAdmin]);

  return (
    <section id="consulting" className="py-20 border-t border-slate-800/80 bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Razorpay & Paytm Gateways Integrated</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              07. Technical Advisory & 1:1 Sessions
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Book specialized 1:1 sessions for machine learning architecture audits, mock technical interviews, or support open-source research. Instant confirmation via Razorpay and Paytm.
            </p>
          </div>

          {/* Gateway Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
              <CreditCard className="w-3.5 h-3.5 text-blue-400" />
              <span>Razorpay (UPI · Cards · NetBanking)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>Paytm Gateway (QR · UPI)</span>
            </div>
          </div>
        </div>

        {/* Pricing & Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CONSULTATION_PACKAGES.map((pkg: ServicePackage) => {
            const isFeatured = pkg.id === 'code_review';
            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 border ${
                  isFeatured
                    ? 'bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-950 border-blue-500/60 shadow-xl shadow-blue-500/10'
                    : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 left-7 px-3 py-1 bg-blue-600 text-[10px] font-mono font-bold text-white uppercase tracking-wider rounded-full shadow-md flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-300" />
                    <span>Recommended for Teams</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono text-blue-400 uppercase tracking-wider">
                      {pkg.tag}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {pkg.duration}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white font-display mb-2">
                    {pkg.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    {pkg.description}
                  </p>

                  <div className="space-y-2.5 mb-8 pb-6 border-b border-slate-800/60 text-xs text-slate-300">
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline gap-1.5 mb-5">
                    <span className="text-3xl font-extrabold text-white font-display">
                      ₹{pkg.price}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">INR</span>
                    <span className="text-slate-500 text-xs">/ per session</span>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => onOpenPaymentModal(pkg.id)}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
                        isFeatured
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                      }`}
                    >
                      <span>Book with Razorpay / Paytm</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-slate-500 text-center">
                      <span>✓ Cards, UPI & Wallets</span>
                      <span>·</span>
                      <span>✓ 100% Refund Guarantee</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Freelance / Advisory Banner */}
        <div className="mt-8 p-6 bg-slate-950/80 border border-slate-800 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-display">
                Need a Custom Project Retainer or Enterprise ML Consultancy?
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pay custom token advances directly in INR through Razorpay standard checkout or Paytm UPI QR.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenPaymentModal()}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors whitespace-nowrap"
          >
            Custom Amount Checkout
          </button>
        </div>

        {/* Admin Inbound Transactions Inspection (Owner: kamal19ojha@gmail.com) */}
        {isAdmin && (
          <div className="mt-12 bg-slate-950 border border-blue-900/50 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white font-display">
                  Admin Dashboard: Live Firestore Transactions (`/payments`)
                </h4>
              </div>
              <button
                onClick={() => setShowAdminTab(!showAdminTab)}
                className="text-xs text-blue-400 hover:underline font-mono"
              >
                {showAdminTab ? 'Hide Records' : `View (${payments.length}) Payments`}
              </button>
            </div>

            {showAdminTab && (
              <div className="overflow-x-auto">
                {loadingTransactions ? (
                  <div className="text-xs text-slate-400 py-4">Loading payments from Firestore...</div>
                ) : payments.length === 0 ? (
                  <div className="text-xs text-slate-500 py-3">No payments recorded yet.</div>
                ) : (
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="text-[11px] font-mono text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="pb-2">Date</th>
                        <th className="pb-2">Customer</th>
                        <th className="pb-2">Email</th>
                        <th className="pb-2">Purpose</th>
                        <th className="pb-2">Gateway</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Txn ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                      {payments.map((p) => (
                        <tr key={p.id}>
                          <td className="py-2.5 text-slate-400">
                            {p.createdAt?.toDate ? p.createdAt.toDate().toLocaleDateString() : 'Recent'}
                          </td>
                          <td className="py-2.5 font-sans font-medium text-white">{p.customerName}</td>
                          <td className="py-2.5 text-slate-400">{p.customerEmail}</td>
                          <td className="py-2.5 font-sans text-slate-300">{p.purpose}</td>
                          <td className="py-2.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                p.gateway === 'razorpay'
                                  ? 'bg-blue-900/60 text-blue-300'
                                  : 'bg-cyan-900/60 text-cyan-300'
                              }`}
                            >
                              {p.gateway}
                            </span>
                          </td>
                          <td className="py-2.5 font-bold text-emerald-400">₹{p.amount}</td>
                          <td className="py-2.5 text-slate-500 text-[10px]">{p.transactionId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
