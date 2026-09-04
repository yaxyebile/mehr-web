'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMeherStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import { HeartHandshake, Mail, Lock, User, PhoneCall, ArrowRight, Sparkles } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const { setCurrentUser, users } = useMeherStore();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('+252 ');
    const [password, setPassword] = useState('');

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        const newOwner = {
            id: `usr-owner-${Date.now()}`,
            full_name: fullName,
            email,
            phone,
            role: 'wedding_owner' as const,
            status: 'active' as const,
            created_at: new Date().toISOString(),
        };

        setCurrentUser(newOwner);
        router.push('/weddings/new'); // Direct onboarding wizard!
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-3xl p-8 shadow-2xl space-y-6">

                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto">
                            <HeartHandshake className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black text-white">Event Owner Registration</h2>
                        <p className="text-xs text-slate-400">
                            Register your upcoming wedding to receive guest QR passes & digital Sooryo payments.
                        </p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-amber-400" /> Full Name
                            </label>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="e.g. Jama Ibrahim Duale"
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-900/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-emerald-400" /> Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="jama.event@gmail.com"
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-900/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                                <PhoneCall className="w-3.5 h-3.5 text-cyan-400" /> Phone (EVC / ZAAD Payout)
                            </label>
                            <input
                                type="text"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+252 61 XXX XXXX"
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-900/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5 text-purple-400" /> Create Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-900/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-slate-950 font-black text-xs transition shadow-lg flex items-center justify-center gap-2"
                        >
                            Create Account & Launch Wedding Wizard <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
                        Already have an account?{' '}
                        <Link href="/login" className="text-cyan-400 font-bold hover:underline">
                            Sign In
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
