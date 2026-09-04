'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useMeherStore } from '@/lib/store';
import {
    Users,
    UserPlus,
    ShieldCheck,
    CheckCircle2,
    Ban,
    Mail,
    Phone,
    Calendar,
    Lock,
    Search,
    Sparkles
} from 'lucide-react';

export default function AdminManagementPage() {
    const [mobileSidebar, setMobileSidebar] = useState(false);
    const { users, addAdminUser, updateUserStatus } = useMeherStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('+252 ');
    const [searchQuery, setSearchQuery] = useState('');

    const adminUsers = users.filter((u) => u.role === 'admin' || u.role === 'platform_owner');

    const filteredAdmins = adminUsers.filter((a) =>
        a.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateAdmin = (e: React.FormEvent) => {
        e.preventDefault();
        addAdminUser({ full_name: fullName, email, phone });
        setFullName('');
        setEmail('');
        setPhone('+252 ');
        setIsModalOpen(false);
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
                            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                                Platform Security Governance
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                                Operational Admin Management
                            </h1>
                            <p className="text-xs text-slate-400 mt-1">
                                Provision & control access for regional operational admins across Somalia and Somaliland.
                            </p>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-lg flex items-center gap-2"
                        >
                            <UserPlus className="w-4 h-4" /> Create New Admin
                        </button>
                    </div>

                    {/* Search & Stats Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full sm:w-80">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search admin name or email..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                            />
                        </div>

                        <div className="text-xs text-slate-400 font-semibold">
                            Showing <strong className="text-amber-400">{filteredAdmins.length}</strong> Admin Accounts
                        </div>
                    </div>

                    {/* Admin Table */}
                    <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md shadow-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="py-3 px-4">Admin Name</th>
                                        <th className="py-3 px-4">Role</th>
                                        <th className="py-3 px-4">Contact Information</th>
                                        <th className="py-3 px-4">Created Date</th>
                                        <th className="py-3 px-4 text-center">Status</th>
                                        <th className="py-3 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 text-xs">
                                    {filteredAdmins.map((admin) => (
                                        <tr key={admin.id} className="hover:bg-slate-800/40 transition">
                                            <td className="py-4 px-4 font-bold text-white flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-emerald-900 text-emerald-200 flex items-center justify-center font-black border border-emerald-500/40">
                                                    {admin.full_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold">{admin.full_name}</p>
                                                    <p className="text-[10px] text-slate-500 font-mono">{admin.id}</p>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4">
                                                {admin.role === 'platform_owner' ? (
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                                        Platform Owner
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                        Operational Admin
                                                    </span>
                                                )}
                                            </td>

                                            <td className="py-4 px-4 space-y-0.5">
                                                <p className="text-slate-300 flex items-center gap-1.5">
                                                    <Mail className="w-3 h-3 text-slate-500" /> {admin.email}
                                                </p>
                                                <p className="text-slate-400 font-mono flex items-center gap-1.5">
                                                    <Phone className="w-3 h-3 text-slate-500" /> {admin.phone}
                                                </p>
                                            </td>

                                            <td className="py-4 px-4 text-slate-400 font-mono">
                                                {new Date(admin.created_at).toLocaleDateString()}
                                            </td>

                                            <td className="py-4 px-4 text-center">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${admin.status === 'active'
                                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                                        }`}
                                                >
                                                    {admin.status}
                                                </span>
                                            </td>

                                            <td className="py-4 px-4 text-right">
                                                {admin.role !== 'platform_owner' && (
                                                    <button
                                                        onClick={() =>
                                                            updateUserStatus(
                                                                admin.id,
                                                                admin.status === 'active' ? 'suspended' : 'active'
                                                            )
                                                        }
                                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ml-auto ${admin.status === 'active'
                                                                ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                            }`}
                                                    >
                                                        {admin.status === 'active' ? (
                                                            <>
                                                                <Ban className="w-3.5 h-3.5" /> Suspend
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle2 className="w-3.5 h-3.5" /> Activate
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Modal for Creating Admin */}
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                            <div className="w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <h3 className="font-extrabold text-base text-white">Create Operational Admin</h3>
                                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                                        ✕
                                    </button>
                                </div>

                                <form onSubmit={handleCreateAdmin} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="e.g. Abdirahman Warsame"
                                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="abdi.admin@meherpay.so"
                                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                                        <input
                                            type="text"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+252 63 XXX XXXX"
                                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-amber-500 font-mono"
                                        />
                                    </div>

                                    <div className="pt-2 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="w-1/3 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-2/3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-md"
                                        >
                                            Provision Admin Account
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}
