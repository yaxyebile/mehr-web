'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import StatCard from '@/components/StatCard';
import { useMeherStore } from '@/lib/store';
import {
    ShieldCheck,
    Building2,
    Users,
    QrCode,
    Activity,
    AlertTriangle,
    CheckCircle2,
    Clock,
    TrendingUp
} from 'lucide-react';

export default function AdminDashboardPage() {
    const [mobileSidebar, setMobileSidebar] = useState(false);
    const { weddings, users, transactions, qrCodes, auditLogs } = useMeherStore();

    const totalWeddings = weddings.length;
    const activeWeddings = weddings.filter((w) => w.status === 'active').length;
    const totalEventOwners = users.filter((u) => u.role === 'wedding_owner').length;
    const totalScans = qrCodes.filter((q) => q.status === 'USED').length;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar onToggleMobileSidebar={() => setMobileSidebar(!mobileSidebar)} />

            <div className="flex-1 flex">
                <Sidebar mobileOpen={mobileSidebar} onCloseMobile={() => setMobileSidebar(false)} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border border-emerald-500/30 shadow-2xl">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Admin Operations Center
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-white">
                                Real-Time Regional Operations Monitor
                            </h1>
                            <p className="text-xs text-slate-400 mt-1">
                                Overseeing live wedding door entrance verification and Sooryo collection across Somalia and Somaliland.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-xs font-semibold text-emerald-300">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                            All Systems Operational
                        </div>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <StatCard
                            title="Registered Weddings"
                            value={totalWeddings}
                            subtitle={`${activeWeddings} actively collecting`}
                            icon={Building2}
                            variant="emerald"
                        />

                        <StatCard
                            title="Registered Event Owners"
                            value={totalEventOwners}
                            subtitle="Verified event hosts"
                            icon={Users}
                            variant="cyan"
                        />

                        <StatCard
                            title="Guest Pass Door Scans"
                            value={totalScans}
                            subtitle="Verified at entrance gate"
                            icon={QrCode}
                            variant="gold"
                            pulse
                        />

                        <StatCard
                            title="Security Audit Events"
                            value={auditLogs.length}
                            subtitle="Tracked admin & gate logs"
                            icon={Activity}
                            variant="purple"
                        />
                    </div>

                    {/* Active Regional Weddings Feed */}
                    <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-extrabold text-base text-white">Active Regional Wedding Events</h3>
                                <p className="text-xs text-slate-400">Live guest counts, venue locations, and collected amounts</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {weddings.map((wedding) => {
                                const scannedForThis = qrCodes.filter((q) => q.wedding_id === wedding.id && q.status === 'USED').length;
                                const collectedForThis = transactions
                                    .filter((t) => t.wedding_id === wedding.id && t.status === 'SUCCESS')
                                    .reduce((sum, t) => sum + t.amount, 0);

                                return (
                                    <div
                                        key={wedding.id}
                                        className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-emerald-500/50 transition"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                                                {wedding.status}
                                            </span>
                                            <span className="text-xs font-mono text-slate-500">{wedding.wedding_date}</span>
                                        </div>

                                        <div>
                                            <h4 className="font-extrabold text-sm text-white">
                                                {wedding.groom_name} & {wedding.bride_name}
                                            </h4>
                                            <p className="text-xs text-slate-400 mt-0.5">{wedding.venue}</p>
                                        </div>

                                        <div className="pt-2 border-t border-slate-900 grid grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <span className="text-slate-500 text-[10px] block">Door Scans</span>
                                                <span className="font-bold text-white">{scannedForThis} / {wedding.guest_count}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-slate-500 text-[10px] block">Collected</span>
                                                <span className="font-bold text-emerald-400">${collectedForThis} USD</span>
                                            </div>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Recent Audit Activity */}
                    <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md shadow-2xl space-y-4">
                        <h3 className="font-extrabold text-base text-white">Recent Operations Audit Log</h3>
                        <div className="space-y-2">
                            {auditLogs.slice(0, 5).map((log) => (
                                <div
                                    key={log.id}
                                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <div>
                                            <p className="text-white font-semibold">{log.details}</p>
                                            <p className="text-[10px] text-slate-500">
                                                Actor: <strong className="text-amber-400">{log.user_name}</strong> ({log.role}) • Action: {log.action}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}
