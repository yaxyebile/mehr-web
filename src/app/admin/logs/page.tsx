'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useMeherStore } from '@/lib/store';
import { ScrollText, Search, ShieldCheck, Clock, UserCheck, Activity } from 'lucide-react';

export default function SecurityAuditLogsPage() {
    const [mobileSidebar, setMobileSidebar] = useState(false);
    const { auditLogs } = useMeherStore();

    const [searchQuery, setSearchQuery] = useState('');

    const filteredLogs = auditLogs.filter((log) =>
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar onToggleMobileSidebar={() => setMobileSidebar(!mobileSidebar)} />

            <div className="flex-1 flex">
                <Sidebar mobileOpen={mobileSidebar} onCloseMobile={() => setMobileSidebar(false)} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl">
                        <div>
                            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                                Immutable Security Ledger
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                                System Audit Trail Logs
                            </h1>
                            <p className="text-xs text-slate-400 mt-1">
                                Complete forensic record of administrative actions, gateway updates, and usher door verifications.
                            </p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search audit action or actor name..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                        />
                    </div>

                    {/* Audit Logs Table */}
                    <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md shadow-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="py-3 px-4">Timestamp</th>
                                        <th className="py-3 px-4">Actor Name & Role</th>
                                        <th className="py-3 px-4">Action Code</th>
                                        <th className="py-3 px-4">Audit Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 text-xs">
                                    {filteredLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-800/40 transition">
                                            <td className="py-3.5 px-4 font-mono text-slate-400">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <p className="text-white font-bold">{log.user_name}</p>
                                                <span className="text-[10px] font-mono text-amber-400 uppercase">{log.role}</span>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-slate-950 text-emerald-300 border border-slate-800">
                                                    {log.action}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4 text-slate-200 font-sans leading-relaxed">
                                                {log.details}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}
