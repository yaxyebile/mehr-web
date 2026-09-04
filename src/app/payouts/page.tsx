'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useMeherStore } from '@/lib/store';
import { PaymentMethod } from '@/lib/types';
import { Wallet, DollarSign, ArrowRight, CheckCircle2, Clock, Building2, PhoneCall, ShieldCheck } from 'lucide-react';

export default function PayoutsPage() {
    const [mobileSidebar, setMobileSidebar] = useState(false);
    const { weddings, transactions, payouts, requestPayout, currentUser } = useMeherStore();

    const wedding = weddings.find((w) => w.owner_id === currentUser?.id) || weddings[0];
    const weddingTxns = transactions.filter((t) => t.wedding_id === wedding?.id && t.status === 'SUCCESS');
    const totalCollected = weddingTxns.reduce((sum, t) => sum + t.amount, 0);

    const totalPaidOut = payouts
        .filter((p) => p.wedding_id === wedding?.id && p.status === 'PROCESSED')
        .reduce((sum, p) => sum + p.amount, 0);

    const availableBalance = Math.max(0, totalCollected - totalPaidOut);

    const [payoutAmount, setPayoutAmount] = useState<number>(availableBalance || 500);
    const [method, setMethod] = useState<PaymentMethod>('EVC Plus');
    const [destinationAccount, setDestinationAccount] = useState(currentUser?.phone || '+252 61 999 4433');
    const [submittedMessage, setSubmittedMessage] = useState(false);

    const handleRequestPayout = (e: React.FormEvent) => {
        e.preventDefault();
        if (wedding && payoutAmount > 0) {
            requestPayout(wedding.id, Number(payoutAmount), method, destinationAccount);
            setSubmittedMessage(true);
            setTimeout(() => setSubmittedMessage(false), 5000);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar onToggleMobileSidebar={() => setMobileSidebar(!mobileSidebar)} />

            <div className="flex-1 flex">
                <Sidebar mobileOpen={mobileSidebar} onCloseMobile={() => setMobileSidebar(false)} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl">
                        <div>
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                                Financial Settlement Engine
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                                Financial Payouts & Settlement
                            </h1>
                            <p className="text-xs text-slate-400 mt-1">
                                Transfer collected wedding Sooryo funds directly to your Hormuud EVC Plus, Telesom ZAAD, or Premier Bank account.
                            </p>
                        </div>
                    </div>

                    {/* Balance Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950 to-slate-900 border border-emerald-500/40 shadow-xl">
                            <span className="text-xs font-semibold text-slate-400 uppercase">Available Payout Balance</span>
                            <p className="text-3xl font-black text-white mt-2">${availableBalance.toLocaleString()} USD</p>
                            <span className="text-[11px] text-emerald-400 mt-1 block">5% Platform fee deducted at payout</span>
                        </div>

                        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
                            <span className="text-xs font-semibold text-slate-400 uppercase">Total Collected Sooryo</span>
                            <p className="text-3xl font-black gold-text-gradient mt-2">${totalCollected.toLocaleString()} USD</p>
                            <span className="text-[11px] text-slate-400 mt-1 block">{weddingTxns.length} verified transactions</span>
                        </div>

                        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
                            <span className="text-xs font-semibold text-slate-400 uppercase">Total Settled / Paid Out</span>
                            <p className="text-3xl font-black text-cyan-400 mt-2">${totalPaidOut.toLocaleString()} USD</p>
                            <span className="text-[11px] text-cyan-300 mt-1 block">Disbursed to mobile money</span>
                        </div>
                    </div>

                    {/* Payout Request Form & History Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Payout Form */}
                        <div className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-md shadow-2xl space-y-4">
                            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-amber-400" /> Request Mobile Money Payout
                            </h3>

                            {submittedMessage && (
                                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> Payout request submitted successfully!
                                </div>
                            )}

                            <form onSubmit={handleRequestPayout} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">Payout Amount ($ USD)</label>
                                    <input
                                        type="number"
                                        min="10"
                                        max={availableBalance}
                                        required
                                        value={payoutAmount}
                                        onChange={(e) => setPayoutAmount(Number(e.target.value))}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-900/60 text-xs text-white font-bold focus:border-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">Transfer Gateway</label>
                                    <select
                                        value={method}
                                        onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-900/60 text-xs text-white focus:border-amber-500 font-bold"
                                    >
                                        <option value="EVC Plus">Hormuud EVC Plus</option>
                                        <option value="ZAAD">Telesom ZAAD</option>
                                        <option value="Sahal">Golis Sahal</option>
                                        <option value="Premier Bank">Premier Bank Account</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">Destination Account Number</label>
                                    <input
                                        type="text"
                                        required
                                        value={destinationAccount}
                                        onChange={(e) => setDestinationAccount(e.target.value)}
                                        placeholder="+252 61 XXX XXXX"
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-900/60 text-xs text-white font-mono focus:border-amber-500"
                                    />
                                </div>

                                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                                    <div className="flex justify-between text-slate-400">
                                        <span>Requested Amount:</span>
                                        <span className="text-white">${payoutAmount || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400">
                                        <span>Service Fee (5%):</span>
                                        <span className="text-rose-400">-${((payoutAmount || 0) * 0.05).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-200 font-bold border-t border-slate-900 pt-1">
                                        <span>Net Transfer Amount:</span>
                                        <span className="text-emerald-400">${((payoutAmount || 0) * 0.95).toFixed(2)} USD</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={availableBalance <= 0}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-500 text-slate-950 font-black text-xs transition shadow-lg disabled:opacity-50"
                                >
                                    Confirm Payout Request
                                </button>
                            </form>
                        </div>

                        {/* Payout History */}
                        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md shadow-2xl space-y-4">
                            <h3 className="font-extrabold text-base text-white">Payout Settlement History</h3>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            <th className="py-3 px-4">Date</th>
                                            <th className="py-3 px-4">Method & Account</th>
                                            <th className="py-3 px-4">Requested</th>
                                            <th className="py-3 px-4">Net Amount</th>
                                            <th className="py-3 px-4 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60 text-xs">
                                        {payouts.map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-800/40 transition">
                                                <td className="py-3.5 px-4 font-mono text-slate-400">
                                                    {new Date(p.created_at).toLocaleDateString()}
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <p className="text-white font-bold">{p.method}</p>
                                                    <p className="text-[10px] text-slate-500 font-mono">{p.destination_account}</p>
                                                </td>

                                                <td className="py-3.5 px-4 font-bold text-slate-200">${p.amount}.00</td>

                                                <td className="py-3.5 px-4 font-extrabold text-emerald-400">${p.net_amount}.00</td>

                                                <td className="py-3.5 px-4 text-center">
                                                    <span
                                                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${p.status === 'PROCESSED'
                                                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                                            }`}
                                                    >
                                                        {p.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                </main>
            </div>
        </div>
    );
}
