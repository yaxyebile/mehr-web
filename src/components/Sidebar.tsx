'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMeherStore } from '@/lib/store';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Building2,
    QrCode,
    Wallet,
    ScrollText,
    PlusCircle,
    ShieldAlert,
    ChevronRight,
    ExternalLink,
    Sparkles
} from 'lucide-react';

interface SidebarProps {
    mobileOpen?: boolean;
    onCloseMobile?: () => void;
}

export default function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
    const pathname = usePathname();
    const { currentUser } = useMeherStore();

    const role = currentUser?.role || 'platform_owner';

    const getMenuItems = () => {
        if (role === 'platform_owner') {
            return [
                { label: 'Executive Overview', href: '/owner', icon: LayoutDashboard },
                { label: 'Admin Management', href: '/owner/admins', icon: Users },
                { label: 'Payment Providers', href: '/owner/providers', icon: CreditCard },
                { label: 'System Audit Logs', href: '/admin/logs', icon: ScrollText },
            ];
        } else if (role === 'admin') {
            return [
                { label: 'Operations Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
                { label: 'Wedding Oversight', href: '/admin/weddings', icon: Building2 },
                { label: 'User Directory', href: '/admin/users', icon: Users },
                { label: 'Security Audit Logs', href: '/admin/logs', icon: ScrollText },
            ];
        } else {
            return [
                { label: 'Wedding Dashboard', href: '/dashboard', icon: LayoutDashboard },
                { label: 'New Wedding Wizard', href: '/weddings/new', icon: PlusCircle },
                { label: 'Guest QR Manager', href: '/guests/qr-management', icon: QrCode },
                { label: 'Financial Payouts', href: '/payouts', icon: Wallet },
            ];
        }
    };

    const menuItems = getMenuItems();

    const sidebarContent = (
        <div className="flex flex-col h-full bg-slate-950/95 border-r border-emerald-900/30 text-slate-300 w-64 p-4">
            {/* Role Title Section */}
            <div className="mb-6 p-3 rounded-xl bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-800/40">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    Active Workspace
                </span>
                <h3 className="font-extrabold text-sm text-white capitalize mt-0.5">
                    {role === 'platform_owner'
                        ? 'Executive Portal'
                        : role === 'admin'
                            ? 'Admin Operations'
                            : 'Event Owner Portal'}
                </h3>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-1.5">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onCloseMobile}
                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-emerald-900 to-emerald-800/80 text-amber-300 border border-amber-500/30 shadow-lg shadow-emerald-950/50 font-semibold'
                                    : 'hover:bg-slate-900 hover:text-white text-slate-400'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-emerald-400'}`} />
                                <span>{item.label}</span>
                            </div>
                            {isActive && <ChevronRight className="w-4 h-4 text-amber-400" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Quick Public Gate Action Banner */}
            <div className="mt-auto pt-4 border-t border-slate-800/80">
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-emerald-950/40 border border-amber-500/30">
                    <div className="flex items-center gap-2 mb-1.5">
                        <QrCode className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-slate-200">Door Usher Gate</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug mb-3">
                        Public entrance verification & live payment scanner. No login required.
                    </p>
                    <Link
                        href="/gate/scan"
                        onClick={onCloseMobile}
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition"
                    >
                        Launch Gate Scanner <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block h-[calc(100vh-4rem)] sticky top-16 shrink-0">
                {sidebarContent}
            </aside>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    <div
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
                        onClick={onCloseMobile}
                    />
                    <div className="relative flex-1 max-w-xs w-full z-10 animate-in slide-in-from-left">
                        {sidebarContent}
                    </div>
                </div>
            )}
        </>
    );
}
