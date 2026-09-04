'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useMeherStore } from '@/lib/store';
import {
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Sparkles,
    Building2,
    Calendar,
    Users,
    DollarSign,
    HeartHandshake,
    QrCode
} from 'lucide-react';

export default function NewWeddingWizardPage() {
    const [mobileSidebar, setMobileSidebar] = useState(false);
    const router = useRouter();
    const { addWedding, currentUser } = useMeherStore();

    const [step, setStep] = useState(1);

    // Form State
    const [groomName, setGroomName] = useState('');
    const [brideName, setBrideName] = useState('');
    const [weddingDate, setWeddingDate] = useState('2026-10-15');
    const [venue, setVenue] = useState('Royal Palace Hotel, Mogadishu');
    const [guestCount, setGuestCount] = useState(500);
    const [sooryoAmountPerPerson, setSooryoAmountPerPerson] = useState(25);

    const expectedAmount = guestCount * sooryoAmountPerPerson;
    const serviceFee = expectedAmount * 0.05;

    const handleFinishWizard = () => {
        addWedding({
            owner_id: currentUser ? currentUser.id : 'usr-owner-wedding-1',
            bride_name: brideName || 'Sumaya Liban',
            groom_name: groomName || 'Farhan Mohamed',
            wedding_date: weddingDate,
            venue,
            guest_count: Number(guestCount),
            sooryo_amount_per_person: Number(sooryoAmountPerPerson),
            expected_amount: expectedAmount,
            service_fee: serviceFee,
            status: 'active',
        });

        router.push('/guests/qr-management');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar onToggleMobileSidebar={() => setMobileSidebar(!mobileSidebar)} />

            <div className="flex-1 flex">
                <Sidebar mobileOpen={mobileSidebar} onCloseMobile={() => setMobileSidebar(false)} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto max-w-4xl mx-auto">

                    {/* Header */}
                    <div className="text-center space-y-2">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                            Event Registration Engine
                        </span>
                        <h1 className="text-3xl font-black text-white">New Wedding Onboarding Wizard</h1>
                        <p className="text-xs text-slate-400">
                            Register your wedding event details and auto-generate 500+ printable guest QR passes.
                        </p>
                    </div>

                    {/* Stepper Progress Bar */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
                        {[
                            { num: 1, label: 'Couple Details' },
                            { num: 2, label: 'Venue & Date' },
                            { num: 3, label: 'Guest & Sooryo' },
                            { num: 4, label: 'Review & Confirm' },
                        ].map((s) => (
                            <div key={s.num} className="flex items-center gap-2">
                                <div
                                    className={`w-8 h-8 rounded-full font-extrabold text-xs flex items-center justify-center transition ${step >= s.num
                                            ? 'bg-amber-500 text-slate-950 shadow-md'
                                            : 'bg-slate-800 text-slate-400'
                                        }`}
                                >
                                    {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                                </div>
                                <span className={`hidden sm:inline text-xs font-semibold ${step >= s.num ? 'text-white' : 'text-slate-500'}`}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Wizard Form Container */}
                    <div className="p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-md shadow-2xl space-y-6">

                        {/* STEP 1 */}
                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in">
                                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                                    <HeartHandshake className="w-5 h-5 text-amber-400" /> Step 1: Couple Information
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1">Groom Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={groomName}
                                            onChange={(e) => setGroomName(e.target.value)}
                                            placeholder="e.g. Farhan Mohamed"
                                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-900/60 text-xs text-white focus:outline-none focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1">Bride Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={brideName}
                                            onChange={(e) => setBrideName(e.target.value)}
                                            placeholder="e.g. Sumaya Liban"
                                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-900/60 text-xs text-white focus:outline-none focus:border-amber-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2 */}
                        {step === 2 && (
                            <div className="space-y-4 animate-in fade-in">
                                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-emerald-400" /> Step 2: Venue & Date
                                </h3>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">Venue & Location</label>
                                    <input
                                        type="text"
                                        required
                                        value={venue}
                                        onChange={(e) => setVenue(e.target.value)}
                                        placeholder="e.g. Royal Palace Hotel, Mogadishu"
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-900/60 text-xs text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">Wedding Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={weddingDate}
                                        onChange={(e) => setWeddingDate(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-900/60 text-xs text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                            </div>
                        )}

                        {/* STEP 3 */}
                        {step === 3 && (
                            <div className="space-y-4 animate-in fade-in">
                                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                                    <Users className="w-5 h-5 text-cyan-400" /> Step 3: Guest Capacity & Sooryo Target
                                </h3>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">Expected Guest Count (QR Passes Generated)</label>
                                    <div className="flex gap-2 mb-2">
                                        {[300, 450, 500, 750].map((count) => (
                                            <button
                                                key={count}
                                                type="button"
                                                onClick={() => setGuestCount(count)}
                                                className={`flex-1 py-2 rounded-xl text-xs font-bold transition border ${guestCount === count
                                                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                                                        : 'bg-slate-950 text-slate-300 border-slate-800'
                                                    }`}
                                            >
                                                {count} Guests
                                            </button>
                                        ))}
                                    </div>
                                    <input
                                        type="number"
                                        min="50"
                                        max="2000"
                                        value={guestCount}
                                        onChange={(e) => setGuestCount(Number(e.target.value))}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-900/60 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">Default Sooryo Gift Amount per Person ($ USD)</label>
                                    <input
                                        type="number"
                                        min="10"
                                        value={sooryoAmountPerPerson}
                                        onChange={(e) => setSooryoAmountPerPerson(Number(e.target.value))}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-900/60 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                                    />
                                </div>
                            </div>
                        )}

                        {/* STEP 4 */}
                        {step === 4 && (
                            <div className="space-y-4 animate-in fade-in">
                                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-amber-400" /> Step 4: Final Review & Package Generation
                                </h3>

                                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Couple:</span>
                                        <span className="text-white font-bold">{groomName || 'Farhan'} & {brideName || 'Sumaya'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Venue:</span>
                                        <span className="text-white">{venue}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Generated Pass Passes:</span>
                                        <span className="text-amber-400 font-bold">{guestCount} QR Codes</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Expected Total Collection:</span>
                                        <span className="text-emerald-400 font-extrabold">${expectedAmount.toLocaleString()} USD</span>
                                    </div>
                                    <div className="flex justify-between border-t border-slate-900 pt-2">
                                        <span className="text-slate-400">Platform Service Fee (5%):</span>
                                        <span className="text-purple-300 font-mono">${serviceFee.toFixed(2)} USD</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Controls */}
                        <div className="pt-4 border-t border-slate-800 flex justify-between">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    onClick={() => setStep(step - 1)}
                                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition flex items-center gap-1.5"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>
                            ) : <div />}

                            {step < 4 ? (
                                <button
                                    type="button"
                                    onClick={() => setStep(step + 1)}
                                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-md"
                                >
                                    Next Step <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleFinishWizard}
                                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-500 text-slate-950 text-xs font-black transition flex items-center gap-2 shadow-xl hover:scale-105"
                                >
                                    <QrCode className="w-4 h-4" /> Register & Generate {guestCount} QR Codes
                                </button>
                            )}
                        </div>

                    </div>

                </main>
            </div>
        </div>
    );
}
