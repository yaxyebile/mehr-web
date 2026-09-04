'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMeherStore } from '@/lib/store';
import { UserRole } from '@/lib/types';
import {
    Crown,
    ShieldCheck,
    HeartHandshake,
    QrCode,
    Moon,
    Sun,
    LogOut,
    ChevronDown,
    Menu,
    Sparkles,
    UserCheck
} from 'lucide-react';

interface NavbarProps {
    onToggleMobileSidebar?: () => void;
}

export default function Navbar({ onToggleMobileSidebar }: NavbarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { currentUser, setCurrentUser, theme, toggleTheme, users } = useMeherStore();
    const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

    const switchRole = (role: UserRole) => {
        setRoleDropdownOpen(false);
        const targetUser = users.find((u) => u.role === role);
        if (targetUser) {
            setCurrentUser(targetUser);
        } else {
            setCurrentUser({
                id: `usr-demo-${role}`,
                full_name: role === 'platform_owner' ? 'Mahad Mohamed' : role === 'admin' ? 'Amina Hassan' : 'Jama Ibrahim',
                email: `${role}@meherpay.so`,
                phone: '+252 61 555 0000',
                role: role,
                status: 'active',
                created_at: new Date().toISOString()
            });
        }

        if (role === 'platform_owner') router.push('/owner');
        else if (role === 'admin') router.push('/admin/dashboard');
        else if (role === 'wedding_owner') router.push('/dashboard');
        else router.push('/gate/scan');
    };

    const getRoleBadge = () => {
        if (!currentUser) return null;
        switch (currentUser.role) {
            case 'platform_owner':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <Crown className="w-3.5 h-3.5 text-amber-400" /> Platform Owner
                    </span>
                );
            case 'admin':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Operations Admin
                    </span>
                );
            case 'wedding_owner':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        <HeartHandshake className="w-3.5 h-3.5 text-cyan-400" /> Event Owner
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        <QrCode className="w-3.5 h-3.5 text-purple-400" /> Door Usher
                    </span>
                );
        }
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b border-emerald-900/40 bg-slate-950/80 backdrop-blur-md">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Left Side: Brand & Mobile Menu Toggle */}
                <div className="flex items-center gap-3">
                    {onToggleMobileSidebar && (
                        <button
                            onClick={onToggleMobileSidebar}
                            className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 lg:hidden"
                            aria-label="Toggle menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    )}

                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 via-emerald-600 to-amber-400 p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-300">
                            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-amber-400" />
                            </div>
                        </div>
                        <div>
                            <span className="font-extrabold text-xl tracking-wider text-white flex items-center gap-1">
                                MEHER <span className="gold-text-gradient">PAY</span>
                            </span>
                            <span className="text-[10px] uppercase font-semibold text-emerald-400 tracking-widest block -mt-1">
                                Digital Sooryo Platform
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Center: Live Supabase Status Indicator & Quick Usher Shortcut */}
                <div className="hidden md:flex items-center gap-4">


                    <Link
                        href="/gate/scan"
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 shadow-md hover:shadow-amber-500/25 transition-all"
                    >
                        <QrCode className="w-4 h-4" /> Public Usher Gate
                    </Link>
                </div>

                {/* Right Side: Role Switcher Demo Tool & Theme & User Profile */}
                <div className="flex items-center gap-3">

                    {/* Quick Role Switcher Dropdown for Testing */}
                    <div className="relative">
                        <button
                            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-emerald-500/30 text-xs text-slate-200 hover:bg-slate-800 transition"
                        >
                            {getRoleBadge()}
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        </button>

                        {roleDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-emerald-500/30 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                <div className="px-3 py-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800">
                                    Switch Portal View
                                </div>

                                <button
                                    onClick={() => switchRole('platform_owner')}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-emerald-950/60 hover:text-amber-300 transition"
                                >
                                    <Crown className="w-4 h-4 text-amber-400" /> Platform Owner (/owner)
                                </button>

                                <button
                                    onClick={() => switchRole('admin')}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-emerald-950/60 hover:text-emerald-300 transition"
                                >
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Admin Ops (/admin)
                                </button>

                                <button
                                    onClick={() => switchRole('wedding_owner')}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-emerald-950/60 hover:text-cyan-300 transition"
                                >
                                    <HeartHandshake className="w-4 h-4 text-cyan-400" /> Event Owner (/dashboard)
                                </button>

                                <button
                                    onClick={() => switchRole('usher')}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-emerald-950/60 hover:text-purple-300 transition"
                                >
                                    <QrCode className="w-4 h-4 text-purple-400" /> Door Usher Gate (/gate/scan)
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-amber-400 hover:bg-slate-800 transition"
                        title="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                    </button>

                    {/* User Profile / Logout */}
                    {currentUser ? (
                        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                            <div className="w-8 h-8 rounded-full bg-emerald-900 text-emerald-200 flex items-center justify-center font-bold text-xs border border-emerald-500/40">
                                {currentUser.full_name.charAt(0)}
                            </div>
                            <div className="hidden xl:block text-left text-xs">
                                <p className="font-semibold text-slate-200 leading-none">{currentUser.full_name}</p>
                                <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{currentUser.email}</p>
                            </div>
                            <button
                                onClick={() => setCurrentUser(null)}
                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition"
                                title="Sign out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white transition"
                        >
                            Sign In
                        </Link>
                    )}

                </div>

            </div>
        </header>
    );
}
