'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useMeherStore } from '@/lib/store';
import { Users, Search, Mail, Phone, Calendar, Ban, CheckCircle2, HeartHandshake } from 'lucide-react';

export default function AdminUsersPage() {
    const [mobileSidebar, setMobileSidebar] = useState(false);
    const { users, updateUserStatus } = useMeherStore();

    const [searchQuery, setSearchQuery] = useState('');

    const eventOwners = users.filter((u) => u.role === 'wedding_owner');

    const filteredOwners = eventOwners.filter((o) =>
        o.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.phone.toLowerCase().includes(searchQuery.toLowerCase())
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
                            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                                Registered Event Owners Directory
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                                Event Host Management
                            </h1>
                            <p className="text-xs text-slate-400 mt-1">
                                View & manage verified wedding owners registered across Somalia and Somaliland.
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
                            placeholder="Search event owner name or phone..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                    </div>

                    {/* Users Table */}
                    <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md shadow-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="py-3 px-4">Event Owner Name</th>
                                        <th className="py-3 px-4">Email</th>
                                        <th className="py-3 px-4">Payout Mobile Phone</th>
                                        <th className="py-3 px-4">Registration Date</th>
                                        <th className="py-3 px-4 text-center">Account Status</th>
                                        <th className="py-3 px-4 text-right">Moderation Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 text-xs">
                                    {filteredOwners.map((owner) => (
                                        <tr key={owner.id} className="hover:bg-slate-800/40 transition">
                                            <td className="py-4 px-4 font-bold text-white flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-cyan-950 text-cyan-300 flex items-center justify-center font-black border border-cyan-500/40">
                                                    <HeartHandshake className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold">{owner.full_name}</p>
                                                    <p className="text-[10px] text-slate-500 font-mono">{owner.id}</p>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4 text-slate-300">{owner.email}</td>

                                            <td className="py-4 px-4 text-emerald-400 font-mono font-semibold">
                                                {owner.phone}
                                            </td>

                                            <td className="py-4 px-4 text-slate-400 font-mono">
                                                {new Date(owner.created_at).toLocaleDateString()}
                                            </td>

                                            <td className="py-4 px-4 text-center">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${owner.status === 'active'
                                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                                        }`}
                                                >
                                                    {owner.status}
                                                </span>
                                            </td>

                                            <td className="py-4 px-4 text-right">
                                                <button
                                                    onClick={() =>
                                                        updateUserStatus(
                                                            owner.id,
                                                            owner.status === 'active' ? 'suspended' : 'active'
                                                        )
                                                    }
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5 ${owner.status === 'active'
                                                            ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                        }`}
                                                >
                                                    {owner.status === 'active' ? (
                                                        <>
                                                            <Ban className="w-3.5 h-3.5" /> Suspend Host
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle2 className="w-3.5 h-3.5" /> Activate Host
                                                        </>
                                                    )}
                                                </button>
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
