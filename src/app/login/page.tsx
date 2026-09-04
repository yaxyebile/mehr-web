'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMeherStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import { Sparkles, Lock, Mail, Crown, ShieldCheck, HeartHandshake, ArrowRight, UserCheck } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { setCurrentUser, users } = useMeherStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

        if (existingUser) {
            setCurrentUser(existingUser);
            if (existingUser.role === 'platform_owner') router.push('/owner');
            else if (existingUser.role === 'admin') router.push('/admin/dashboard');
            else router.push('/dashboard');
        } else {
            // Create guest session for input email
            const role = email.includes('owner') ? 'platform_owner' : email.includes('admin') ? 'admin' : 'wedding_owner';
            const newUser = {
                id: `usr-${Date.now()}`,
                full_name: email.split('@')[0].toUpperCase(),
                email,
                phone: '+252 61 555 0000',
                role: role as any,
                status: 'active' as any,
                created_at: new Date().toISOString(),
            };
            setCurrentUser(newUser);
            if (role === 'platform_owner') router.push('/owner');
            else if (role === 'admin') router.push('/admin/dashboard');
            else router.push('/dashboard');
        }
    };

    const autoFillDemo = (role: 'platform_owner' | 'admin' | 'wedding_owner') => {
        if (role === 'platform_owner') {
            setEmail('owner@meherpay.so');
            setPassword('OwnerSecret2026!');
        } else if (role === 'admin') {
            setEmail('amina.admin@meherpay.so');
            setPassword('AdminSecret2026!');
        } else {
            setEmail('jama.event@gmail.com');
            setPassword('EventSecret2026!');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl space-y-6">

                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black text-white">Sign In to Meher Pay</h2>
                        <p className="text-xs text-slate-400">
                            Access Executive Owner, Admin Operations, or Event Owner Dashboard
                        </p>
                    </div>

                    {/* Demo Quick-Fill Buttons */}
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block text-center">
                            Developer Demo Credentials Auto-Fill
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => autoFillDemo('platform_owner')}
                                className="py-1.5 px-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold transition flex items-center justify-center gap-1"
                            >
                                <Crown className="w-3 h-3 text-amber-400" /> Owner
                            </button>
                            <button
                                type="button"
                                onClick={() => autoFillDemo('admin')}
                                className="py-1.5 px-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition flex items-center justify-center gap-1"
                            >
                                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Admin
                            </button>
                            <button
                                type="button"
                                onClick={() => autoFillDemo('wedding_owner')}
                                className="py-1.5 px-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold transition flex items-center justify-center gap-1"
                            >
                                <HeartHandshake className="w-3 h-3 text-cyan-400" /> Event
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-emerald-400" /> Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@meherpay.so"
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-900/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5 text-amber-400" /> Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-900/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-slate-950 font-black text-xs transition shadow-lg flex items-center justify-center gap-2"
                        >
                            Sign In Now <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
                        Are you a new Event / Wedding Owner?{' '}
                        <Link href="/register" className="text-amber-400 font-bold hover:underline">
                            Register Here
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
