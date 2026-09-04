'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useMeherStore } from '@/lib/store';
import {
    Crown,
    ShieldCheck,
    HeartHandshake,
    QrCode,
    Sparkles,
    ArrowRight,
    CreditCard,
    Activity,
    Lock,
    Smartphone,
    CheckCircle2,
    Building2,
    TrendingUp,
    Wallet
} from 'lucide-react';

export default function LandingPage() {
    const { initRealtime, transactions, weddings, qrCodes } = useMeherStore();

    useEffect(() => {
        initRealtime();
    }, [initRealtime]);

    const totalRevenue = transactions.reduce((acc, t) => acc + (t.status === 'SUCCESS' ? t.amount : 0), 0);
    const activeWeddingsCount = weddings.filter((w) => w.status === 'active').length;
    const usedQrsCount = qrCodes.filter((q) => q.status === 'USED').length;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 bg-gradient-to-b from-emerald-950/40 via-slate-950 to-slate-950">

                {/* Background Glow Orbs */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto space-y-6">

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-amber-500/40 shadow-xl text-xs font-semibold text-amber-300 animate-pulse-slow">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span>Next-Gen Somali Digital Wedding Sooryo Platform</span>
                        </div>

                        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
                            Modernizing Somali <br />
                            <span className="gold-text-gradient">Meher & Sooryo</span> Payments
                        </h1>

                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                            Seamlessly collect wedding gifts, manage 500+ guest QR passes, verify door entries live, and pay out instantly via EVC Plus, ZAAD, Sahal & Premier Bank.
                        </p>

                        {/* Quick Portal Access Buttons */}
                        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                            <Link
                                href="/gate/scan"
                                className="px-6 py-3.5 rounded-2xl font-extrabold text-sm bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-xl hover:shadow-amber-500/25 transition-all flex items-center gap-2"
                            >
                                <QrCode className="w-5 h-5" /> Launch Usher Gate Scanner <ArrowRight className="w-4 h-4" />
                            </Link>

                            <Link
                                href="/login"
                                className="px-6 py-3.5 rounded-2xl font-bold text-sm bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 text-slate-200 transition flex items-center gap-2"
                            >
                                Sign In to Portal
                            </Link>
                        </div>

                    </div>

                    {/* Key Live Performance Stat Cards Banner */}
                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-5 rounded-2xl bg-slate-900/70 border border-amber-500/30 backdrop-blur-md">
                            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                                <span>Total Sooryo Processed</span>
                                <Wallet className="w-4 h-4 text-amber-400" />
                            </div>
                            <p className="text-2xl font-black gold-text-gradient mt-2">${totalRevenue.toLocaleString()}+ USD</p>
                            <span className="text-[11px] text-emerald-400 mt-1 block">Live Supabase Sync</span>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-900/70 border border-emerald-500/30 backdrop-blur-md">
                            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                                <span>Active Weddings</span>
                                <Building2 className="w-4 h-4 text-emerald-400" />
                            </div>
                            <p className="text-2xl font-black text-white mt-2">{activeWeddingsCount} Weddings</p>
                            <span className="text-[11px] text-slate-400 mt-1 block">Mogadishu, Hargeisa, Garowe</span>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-900/70 border border-cyan-500/30 backdrop-blur-md">
                            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                                <span>Gate Scanned Passes</span>
                                <QrCode className="w-4 h-4 text-cyan-400" />
                            </div>
                            <p className="text-2xl font-black text-white mt-2">{usedQrsCount} / {qrCodes.length}</p>
                            <span className="text-[11px] text-cyan-400 mt-1 block">Instant Door Verification</span>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-900/70 border border-purple-500/30 backdrop-blur-md">
                            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                                <span>Supported Providers</span>
                                <CreditCard className="w-4 h-4 text-purple-400" />
                            </div>
                            <p className="text-2xl font-black text-white mt-2">5 Gateways</p>
                            <span className="text-[11px] text-purple-300 mt-1 block">EVC, ZAAD, Sahal, Premier, Visa</span>
                        </div>
                    </div>

                </div>
            </section>

            {/* Role Navigation Hub */}
            <section className="py-16 bg-slate-950 border-t border-emerald-900/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="text-center max-w-xl mx-auto mb-12">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                            Multi-Tenant System Portals
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                            Select Your Role Portal to Explore
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* Platform Owner */}
                        <Link
                            href="/owner"
                            className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/40 hover:border-amber-400 hover:scale-105 transition-all duration-300 group shadow-xl flex flex-col justify-between"
                        >
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
                                    <Crown className="w-6 h-6" />
                                </div>
                                <h3 className="font-extrabold text-lg text-white mb-2 group-hover:text-amber-300">
                                    Platform Owner Portal
                                </h3>
                                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                    Executive dashboard showing platform revenue ($9,210+), service fees, admin management, and EVC/ZAAD payment provider gateways.
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:underline">
                                Enter Owner Portal <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                        </Link>

                        {/* Admin Operations */}
                        <Link
                            href="/admin/dashboard"
                            className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/40 hover:border-emerald-400 hover:scale-105 transition-all duration-300 group shadow-xl flex flex-col justify-between"
                        >
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-slate-950 transition">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <h3 className="font-extrabold text-lg text-white mb-2 group-hover:text-emerald-300">
                                    Admin Operations Portal
                                </h3>
                                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                    Real-time regional wedding oversight across Somalia/Somaliland, event suspension control, user directory, and security audit logs.
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:underline">
                                Enter Admin Portal <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                        </Link>

                        {/* Event Owner */}
                        <Link
                            href="/dashboard"
                            className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/40 hover:border-cyan-400 hover:scale-105 transition-all duration-300 group shadow-xl flex flex-col justify-between"
                        >
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-4 group-hover:bg-cyan-500 group-hover:text-slate-950 transition">
                                    <HeartHandshake className="w-6 h-6" />
                                </div>
                                <h3 className="font-extrabold text-lg text-white mb-2 group-hover:text-cyan-300">
                                    Event Owner Portal
                                </h3>
                                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                    Wedding setup wizard, live collection analytics, 500+ guest QR code PDF sheet generator, and EVC/ZAAD payout request form.
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 group-hover:underline">
                                Enter Event Portal <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                        </Link>

                        {/* Public Door Usher Gate */}
                        <Link
                            href="/gate/scan"
                            className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/40 hover:border-purple-400 hover:scale-105 transition-all duration-300 group shadow-xl flex flex-col justify-between"
                        >
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:bg-purple-500 group-hover:text-slate-950 transition">
                                    <QrCode className="w-6 h-6" />
                                </div>
                                <h3 className="font-extrabold text-lg text-white mb-2 group-hover:text-purple-300">
                                    Public Door Usher Gate
                                </h3>
                                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                    No-login entrance scanner. Scans guest webcam QR codes, processes instant EVC/ZAAD payments, prints PDF receipt, and syncs live to Supabase.
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 group-hover:underline">
                                Launch Gate Scanner <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                        </Link>

                    </div>

                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto py-8 bg-slate-950 border-t border-slate-900 text-center text-xs text-slate-500">
                <p>© 2026 MEHER PAY Platform. Sharing database with Meher Flutter App via Supabase backend.</p>
            </footer>
        </div>
    );
}
