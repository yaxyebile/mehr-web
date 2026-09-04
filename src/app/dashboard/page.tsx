'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import StatCard from '@/components/StatCard';
import { useMeherStore } from '@/lib/store';
import {
    HeartHandshake,
    QrCode,
    Wallet,
    Building2,
    PlusCircle,
    ArrowUpRight,
    Printer,
    Sparkles,
    TrendingUp
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function EventOwnerDashboardPage() {
    const [mobileSidebar, setMobileSidebar] = useState(false);
    const { weddings, qrCodes, transactions, currentUser } = useMeherStore();

    // Find owner wedding or default to first active wedding
    const wedding = weddings.find((w) => w.owner_id === currentUser?.id) || weddings[0];

    const weddingQrs = qrCodes.filter((q) => q.wedding_id === wedding?.id);
    const scannedQrs = weddingQrs.filter((q) => q.status === 'USED');
    const weddingTxns = transactions.filter((t) => t.wedding_id === wedding?.id && t.status === 'SUCCESS');

    const totalCollected = weddingTxns.reduce((sum, t) => sum + t.amount, 0);
    const progressPercent = wedding ? Math.min(100, Math.round((totalCollected / wedding.expected_amount) * 100)) : 0;

    const pieData = [
        { name: 'EVC Plus', value: 55, color: '#10b981' },
        { name: 'ZAAD', value: 30, color: '#f59e0b' },
        { name: 'Premier Bank', value: 15, color: '#a855f7' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar onToggleMobileSidebar={() => setMobileSidebar(!mobileSidebar)} />

            <div className="flex-1 flex">
                <Sidebar mobileOpen={mobileSidebar} onCloseMobile={() => setMobileSidebar(false)} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">

                    {/* Hero Wedding Banner */}
                    {wedding ? (
                        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950/40 border border-amber-500/30 shadow-2xl relative overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                <div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-3">
                                        <HeartHandshake className="w-3.5 h-3.5 text-amber-400" /> Event Owner Dashboard
                                    </div>

                                    <h1 className="text-3xl sm:text-4xl font-black text-white">
                                        {wedding.groom_name} & {wedding.bride_name} Wedding
                                    </h1>
                                    <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-emerald-400" /> {wedding.venue} • {wedding.wedding_date}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <Link
                                        href="/guests/qr-management"
                                        className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-lg flex items-center gap-2"
                                    >
                                        <QrCode className="w-4 h-4" /> Guest QR Manager ({weddingQrs.length})
                                    </Link>

                                    <Link
                                        href="/payouts"
                                        className="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition flex items-center gap-2"
                                    >
                                        <Wallet className="w-4 h-4" /> Request Payout
                                    </Link>
                                </div>
                            </div>

                            {/* Progress Bar for Expected Sooryo Target */}
                            <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-2">
                                <div className="flex justify-between text-xs font-semibold">
                                    <span className="text-slate-300">Target Sooryo Goal (${wedding.expected_amount.toLocaleString()} USD)</span>
                                    <span className="text-amber-400 font-bold">{progressPercent}% Collected</span>
                                </div>
                                <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-emerald-900/60">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-1000"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
                            <h3 className="text-xl font-bold text-white">No Registered Wedding Found</h3>
                            <p className="text-xs text-slate-400">Launch the onboarding wizard to register your wedding event.</p>
                            <Link
                                href="/weddings/new"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs"
                            >
                                <PlusCircle className="w-4 h-4" /> Launch 4-Step Onboarding Wizard
                            </Link>
                        </div>
                    )}

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <StatCard
                            title="Collected Sooryo Funds"
                            value={`$${totalCollected.toLocaleString()} USD`}
                            subtitle="Ready for mobile payout"
                            icon={Wallet}
                            variant="gold"
                            pulse
                        />

                        <StatCard
                            title="Door Entrance Scans"
                            value={`${scannedQrs.length} / ${weddingQrs.length}`}
                            subtitle="Verified by Usher Gate"
                            icon={QrCode}
                            variant="emerald"
                        />

                        <StatCard
                            title="Guest Pass QR Set"
                            value={wedding?.guest_count || 0}
                            subtitle="Printable QR cards"
                            icon={Printer}
                            variant="cyan"
                        />

                        <StatCard
                            title="Platform Fee (5%)"
                            value={`$${(totalCollected * 0.05).toFixed(2)}`}
                            subtitle="Net payout available"
                            icon={Building2}
                            variant="purple"
                        />
                    </div>

                    {/* Analytics & Recent Payments Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Recent Payments Feed */}
                        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md shadow-2xl space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-extrabold text-base text-white">Live Guest Payments Feed</h3>
                                <span className="text-xs text-emerald-400 font-semibold">Updating Live via Supabase</span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            <th className="py-3 px-4">Receipt</th>
                                            <th className="py-3 px-4">Honored Payer</th>
                                            <th className="py-3 px-4">Payment Method</th>
                                            <th className="py-3 px-4 text-right">Sooryo Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60 text-xs">
                                        {weddingTxns.map((t) => (
                                            <tr key={t.id} className="hover:bg-slate-800/40 transition">
                                                <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">{t.receipt_number}</td>
                                                <td className="py-3.5 px-4">
                                                    <p className="text-white font-bold">{t.payer_name}</p>
                                                    <p className="text-[10px] text-slate-500 font-mono">{t.payer_phone}</p>
                                                </td>
                                                <td className="py-3.5 px-4 font-bold text-amber-400">{t.payment_method}</td>
                                                <td className="py-3.5 px-4 text-right font-extrabold text-white">${t.amount}.00 USD</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Distribution Chart */}
                        <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md shadow-2xl flex flex-col justify-between">
                            <div>
                                <h3 className="font-extrabold text-base text-white">Payment Method Distribution</h3>
                                <p className="text-xs text-slate-400"> breakdown by EVC Plus vs ZAAD</p>
                            </div>

                            <div className="h-48 w-full my-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="space-y-2 text-xs">
                                {pieData.map((item) => (
                                    <div key={item.name} className="flex justify-between items-center">
                                        <span className="text-slate-300 flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} /> {item.name}
                                        </span>
                                        <span className="font-bold text-white">{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </main>
            </div>
        </div>
    );
}
