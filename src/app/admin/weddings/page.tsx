'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useMeherStore } from '@/lib/store';
import { WeddingStatus } from '@/lib/types';
import {
    Building2,
    Search,
    Filter,
    CheckCircle2,
    Ban,
    AlertTriangle,
    Calendar,
    MapPin,
    Users,
    DollarSign
} from 'lucide-react';

export default function WeddingOversightPage() {
    const [mobileSidebar, setMobileSidebar] = useState(false);
    const { weddings, updateWeddingStatus } = useMeherStore();

    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredWeddings = weddings.filter((w) => {
        const matchesStatus = filterStatus === 'all' || w.status === filterStatus;
        const matchesSearch =
            w.bride_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            w.groom_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            w.venue.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

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
                                Regional Event Compliance
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                                Wedding Oversight & Moderation
                            </h1>
                            <p className="text-xs text-slate-400 mt-1">
                                Filter registered weddings across active, completed, or suspended states. Flag or suspend suspicious activity.
                            </p>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full sm:w-80">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by couple name or venue..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                            />
                        </div>

                        {/* Filter Pills */}
                        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
                            {['all', 'active', 'completed', 'suspended'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${filterStatus === status
                                            ? 'bg-emerald-700 text-white shadow-md'
                                            : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Wedding Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredWeddings.map((wedding) => (
                            <div
                                key={wedding.id}
                                className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-md shadow-2xl flex flex-col justify-between space-y-4"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[10px] font-mono text-emerald-400 font-bold">{wedding.id}</span>
                                        <span
                                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${wedding.status === 'active'
                                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                                    : wedding.status === 'completed'
                                                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                                }`}
                                        >
                                            {wedding.status}
                                        </span>
                                    </div>

                                    <h3 className="font-extrabold text-lg text-white">
                                        {wedding.groom_name} & {wedding.bride_name}
                                    </h3>

                                    <div className="space-y-1.5 mt-3 text-xs text-slate-300">
                                        <p className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-amber-400" /> {wedding.venue}
                                        </p>
                                        <p className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Date: {wedding.wedding_date}
                                        </p>
                                        <p className="flex items-center gap-1.5">
                                            <Users className="w-3.5 h-3.5 text-cyan-400" /> Guests: {wedding.guest_count} Allowed
                                        </p>
                                        <p className="flex items-center gap-1.5">
                                            <DollarSign className="w-3.5 h-3.5 text-purple-400" /> Target: ${wedding.expected_amount} USD
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-slate-800 flex gap-2">
                                    {wedding.status === 'active' ? (
                                        <button
                                            onClick={() => updateWeddingStatus(wedding.id, 'suspended')}
                                            className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5"
                                        >
                                            <Ban className="w-3.5 h-3.5" /> Suspend Event
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => updateWeddingStatus(wedding.id, 'active')}
                                            className="w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5"
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Set Active
                                        </button>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>

                </main>
            </div>
        </div>
    );
}
