'use client';

import React, { useState } from 'react';
import { QrCode, Transaction, PaymentMethod } from '@/lib/types';
import { useMeherStore } from '@/lib/store';
import confetti from 'canvas-confetti';
import {
    X,
    CheckCircle2,
    CreditCard,
    PhoneCall,
    User,
    DollarSign,
    Sparkles,
    Printer,
    Download,
    ShieldCheck,
    Building
} from 'lucide-react';

interface PaymentModalProps {
    qrCode: QrCode;
    onClose: () => void;
    onSuccess: (txn: Transaction) => void;
}

export default function PaymentModal({ qrCode, onClose, onSuccess }: PaymentModalProps) {
    const { weddings, paymentProviders, processGatePayment } = useMeherStore();
    const wedding = weddings.find((w) => w.id === qrCode.wedding_id);

    const [payerName, setPayerName] = useState('');
    const [payerPhone, setPayerPhone] = useState('+252 ');
    const [amount, setAmount] = useState<number>(qrCode.amount || 25);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('EVC Plus');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [completedTxn, setCompletedTxn] = useState<Transaction | null>(null);

    const activeProviders = paymentProviders.filter((p) => p.status === 'active');

    const handleSubmitPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const txn = await processGatePayment({
                qrCode,
                payer_name: payerName.trim() || 'Honored Guest',
                payer_phone: payerPhone.trim() || '+252 61 000 0000',
                amount: Number(amount),
                payment_method: selectedMethod,
            });

            // Fire celebratory confetti!
            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#0F5132', '#D4AF37', '#34d399', '#fde047'],
            });

            setCompletedTxn(txn);
            onSuccess(txn);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-950 to-slate-900 border-b border-emerald-900/40">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-white">Digital Sooryo Payment</h3>
                            <p className="text-[11px] font-mono text-emerald-400">{qrCode.qr_code_id}</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">

                    {/* Wedding Event Info Banner */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                        <div>
                            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                                Event Details
                            </span>
                            <h4 className="font-bold text-sm text-white mt-0.5">
                                {wedding ? `${wedding.groom_name} & ${wedding.bride_name} Wedding` : 'Somali Wedding Celebration'}
                            </h4>
                            <p className="text-xs text-slate-400">{wedding?.venue || 'Royal Hotel Hall'}</p>
                        </div>

                        <div className="text-right">
                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Default Sooryo</span>
                            <span className="text-lg font-extrabold gold-text-gradient">${qrCode.amount}</span>
                        </div>
                    </div>

                    {/* Success State Screen */}
                    {completedTxn ? (
                        <div className="py-6 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                                <CheckCircle2 className="w-9 h-9" />
                            </div>

                            <div>
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                                    Payment Verified & Completed
                                </span>
                                <h3 className="text-2xl font-black text-white mt-1">
                                    ${completedTxn.amount}.00 USD
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Receipt #{completedTxn.receipt_number} • {completedTxn.payment_method}
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs space-y-1.5 font-mono">
                                <div className="flex justify-between text-slate-400">
                                    <span>Payer Name:</span>
                                    <span className="text-white font-sans">{completedTxn.payer_name}</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>Phone Number:</span>
                                    <span className="text-white">{completedTxn.payer_phone}</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>Provider Reference:</span>
                                    <span className="text-emerald-400">{completedTxn.provider_reference}</span>
                                </div>
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    onClick={() => window.print()}
                                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2"
                                >
                                    <Printer className="w-4 h-4" /> Print Receipt
                                </button>
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                                >
                                    Done / Next Scan
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Payment Input Form */
                        <form onSubmit={handleSubmitPayment} className="space-y-4">

                            {/* Payer Name */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-amber-400" /> Guest Payer Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={payerName}
                                    onChange={(e) => setPayerName(e.target.value)}
                                    placeholder="e.g. Hassan Ali Warsame"
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-900/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                                />
                            </div>

                            {/* Payer Phone */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> Payer Mobile Phone
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={payerPhone}
                                    onChange={(e) => setPayerPhone(e.target.value)}
                                    placeholder="+252 61 XXX XXXX"
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-900/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                                />
                            </div>

                            {/* Sooryo Amount */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                                    <DollarSign className="w-3.5 h-3.5 text-gold-400" /> Sooryo Amount ($ USD)
                                </label>
                                <div className="flex gap-2">
                                    {[25, 30, 50, 100].map((preset) => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => setAmount(preset)}
                                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition border ${amount === preset
                                                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                                                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                                                }`}
                                        >
                                            ${preset}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="number"
                                    min="5"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    className="w-full mt-2 px-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-900/60 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                                />
                            </div>

                            {/* Payment Method Selector */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                                    <CreditCard className="w-3.5 h-3.5 text-cyan-400" /> Select Payment Provider
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { name: 'EVC Plus', prov: 'Hormuud Telecom', color: 'border-emerald-500/40 text-emerald-400' },
                                        { name: 'ZAAD', prov: 'Telesom Somaliland', color: 'border-amber-500/40 text-amber-400' },
                                        { name: 'Sahal', prov: 'Golis Puntland', color: 'border-cyan-500/40 text-cyan-400' },
                                        { name: 'Premier Bank', prov: 'Account / Direct', color: 'border-purple-500/40 text-purple-400' },
                                        { name: 'Mastercard/Visa', prov: 'International Card', color: 'border-blue-500/40 text-blue-400' },
                                    ].map((method) => (
                                        <button
                                            key={method.name}
                                            type="button"
                                            onClick={() => setSelectedMethod(method.name as PaymentMethod)}
                                            className={`p-3 rounded-xl border text-left transition ${selectedMethod === method.name
                                                    ? 'bg-emerald-950/80 border-amber-500 shadow-lg ring-1 ring-amber-500'
                                                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className={`text-xs font-bold ${method.color}`}>{method.name}</span>
                                                {selectedMethod === method.name && (
                                                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                                                )}
                                            </div>
                                            <span className="text-[10px] text-slate-500 block mt-0.5">{method.prov}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-slate-950 font-black text-xs transition shadow-lg flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        'Processing Instant Payment...'
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" /> Complete ${amount} Sooryo Payment
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    )}

                </div>

            </div>
        </div>
    );
}
