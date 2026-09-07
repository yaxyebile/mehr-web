'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { QrCode, Wedding } from '@/lib/types';
import {
    CheckCircle2,
    AlertCircle,
    Loader2,
    CreditCard,
    Phone,
    User,
    Sparkles,
    Heart,
    MapPin,
    Calendar,
    DollarSign
} from 'lucide-react';

type PaymentMethod = 'EVC Plus' | 'ZAAD' | 'Sahal' | 'Premier Bank' | 'Mastercard/Visa';
type Step = 'loading' | 'not_found' | 'already_used' | 'form' | 'processing' | 'success';

export default function GuestPayPage() {
    const params = useParams();
    const qrId = params?.qrId as string;

    const [step, setStep] = useState<Step>('loading');
    const [qr, setQr] = useState<QrCode | null>(null);
    const [wedding, setWedding] = useState<Wedding | null>(null);

    const [payerName, setPayerName] = useState('');
    const [payerPhone, setPayerPhone] = useState('');
    const [method, setMethod] = useState<PaymentMethod>('EVC Plus');
    const [receipt, setReceipt] = useState<{ receiptNumber: string; txnId: string } | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!qrId) return;
        loadQr();
    }, [qrId]);

    const loadQr = async () => {
        setStep('loading');
        try {
            // Try by qr_code_id first, then by id
            let { data: qrData } = await supabase
                .from('qr_codes')
                .select('*, wedding:weddings(*)')
                .eq('qr_code_id', qrId)
                .single();

            if (!qrData) {
                const res = await supabase
                    .from('qr_codes')
                    .select('*, wedding:weddings(*)')
                    .eq('id', qrId)
                    .single();
                qrData = res.data;
            }

            if (!qrData) {
                setStep('not_found');
                return;
            }

            setQr(qrData as QrCode);
            if (qrData.wedding) setWedding(qrData.wedding as Wedding);

            if (qrData.status === 'USED') {
                setStep('already_used');
            } else if (qrData.status !== 'ACTIVE') {
                setStep('not_found');
            } else {
                setStep('form');
            }
        } catch {
            setStep('not_found');
        }
    };

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!qr) return;
        if (!payerName.trim() || !payerPhone.trim()) {
            setError('Fadlan magacaaga iyo lambarka telefoonkaaga geli.');
            return;
        }
        setError('');
        setStep('processing');

        try {
            const txnId = `TXN-${Date.now().toString().slice(-6)}`;
            const receiptNum = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
            const now = new Date().toISOString();
            const weddingTitle = wedding
                ? `${wedding.groom_name} & ${wedding.bride_name} Wedding`
                : 'Wedding Sooryo';

            await supabase.from('transactions').insert([{
                id: `tx-${Date.now()}`,
                transaction_id: txnId,
                qr_code_id: qr.qr_code_id,
                wedding_id: qr.wedding_id,
                wedding_title: weddingTitle,
                amount: qr.amount,
                payment_method: method,
                payment_provider: providerLabel(method),
                provider_reference: `REF-${Math.floor(10000000 + Math.random() * 90000000)}`,
                status: 'SUCCESS',
                receipt_number: receiptNum,
                payer_name: payerName,
                payer_phone: payerPhone,
                created_at: now,
                paid_at: now,
            }]);

            await supabase.from('qr_codes').update({
                status: 'USED',
                used_at: now,
                transaction_id: txnId,
            }).eq('qr_code_id', qr.qr_code_id);

            setReceipt({ receiptNumber: receiptNum, txnId });
            setStep('success');
        } catch {
            setError('Lacag bixintu way guul-darrowday. Markale isku day.');
            setStep('form');
        }
    };

    const providerLabel = (m: PaymentMethod) => {
        switch (m) {
            case 'EVC Plus': return 'Hormuud EVC Plus';
            case 'ZAAD': return 'Telesom ZAAD';
            case 'Sahal': return 'Golis Sahal';
            case 'Premier Bank': return 'Premier Bank';
            default: return 'Mastercard / Visa';
        }
    };

    // ── LOADING ──────────────────────────────────────────────────────────────
    if (step === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A1628] via-[#0D2240] to-[#0A1628]">
                <div className="flex flex-col items-center gap-4 text-white">
                    <Loader2 className="w-12 h-12 animate-spin text-[#1DC9A4]" />
                    <p className="text-sm text-slate-400 font-semibold tracking-widest uppercase">Loading Pass...</p>
                </div>
            </div>
        );
    }

    // ── NOT FOUND ────────────────────────────────────────────────────────────
    if (step === 'not_found') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A1628] via-[#0D2240] to-[#0A1628] p-4">
                <div className="max-w-sm w-full text-center space-y-4">
                    <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-10 h-10 text-rose-400" />
                    </div>
                    <h1 className="text-2xl font-black text-white">QR Code Ma Jiro</h1>
                    <p className="text-slate-400 text-sm">
                        Kaardhkan ma la garan karo. Fadlan u sheeg arooska si ay ugu soo bixiyaan kaardh cusub.
                    </p>
                    <p className="text-xs text-slate-600 font-mono">{qrId}</p>
                </div>
            </div>
        );
    }

    // ── ALREADY USED ─────────────────────────────────────────────────────────
    if (step === 'already_used') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A1628] via-[#0D2240] to-[#0A1628] p-4">
                <div className="max-w-sm w-full text-center space-y-4">
                    <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-10 h-10 text-amber-400" />
                    </div>
                    <h1 className="text-2xl font-black text-white">Hore Loo Isticmaalay</h1>
                    <p className="text-slate-400 text-sm">
                        Lacagta kaardhkan horaan loo bixiyay. Mahadsanid diiwaangelintaada!
                    </p>
                    {qr?.used_at && (
                        <p className="text-xs text-slate-500">
                            Waqtiga: {new Date(qr.used_at).toLocaleString()}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // ── SUCCESS ──────────────────────────────────────────────────────────────
    if (step === 'success' && receipt) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A1628] via-[#071C14] to-[#0A1628] p-4">
                <div className="max-w-sm w-full space-y-6">
                    {/* Success Badge */}
                    <div className="text-center space-y-3">
                        <div className="w-24 h-24 bg-[#1DC9A4]/10 border-2 border-[#1DC9A4]/40 rounded-full flex items-center justify-center mx-auto animate-bounce-once">
                            <CheckCircle2 className="w-12 h-12 text-[#1DC9A4]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white">Lacag Bixintu</h1>
                            <h2 className="text-3xl font-black text-[#1DC9A4]">Way Guulaysatay!</h2>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Hambalyo! Sooryadaadu waa la qaatay. Ku soo dhawoow arooska!
                        </p>
                    </div>

                    {/* Receipt Card */}
                    <div className="bg-[#0D1F35] border border-[#1DC9A4]/30 rounded-3xl p-6 space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                            <Sparkles className="w-4 h-4 text-[#1DC9A4]" />
                            <span className="text-xs font-bold text-[#1DC9A4] uppercase tracking-widest">Receipt</span>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Receipt No</span>
                                <span className="font-bold text-white font-mono">{receipt.receiptNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Transaction ID</span>
                                <span className="font-bold text-white font-mono">{receipt.txnId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Magaca</span>
                                <span className="font-bold text-white">{payerName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Habka Lacag Bixinta</span>
                                <span className="font-bold text-white">{method}</span>
                            </div>
                            {wedding && (
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Arooska</span>
                                    <span className="font-bold text-white text-right">{wedding.groom_name} & {wedding.bride_name}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                                <span className="text-slate-400 font-semibold">Sooryo La Bixiyay</span>
                                <span className="text-2xl font-black text-[#1DC9A4]">${qr?.amount?.toFixed(0)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-slate-500 text-xs">Powered by</p>
                        <p className="text-white font-black text-lg tracking-widest">
                            <span className="text-[#1DC9A4]">MEHER</span> PAY
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ── PAYMENT FORM ─────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#0D2240] to-[#0A1628] flex items-center justify-center p-4">
            <div className="max-w-sm w-full space-y-5">

                {/* Header: Meher Pay Brand */}
                <div className="text-center space-y-1">
                    <p className="text-xs text-slate-500 uppercase tracking-widest">Powered by</p>
                    <h1 className="text-3xl font-black tracking-widest">
                        <span className="text-[#1DC9A4]">MEHER</span>
                        <span className="text-white"> PAY</span>
                    </h1>
                </div>

                {/* Wedding Card */}
                {wedding && (
                    <div className="bg-gradient-to-br from-[#1A2F6B]/40 to-[#0D2240] border border-[#1DC9A4]/30 rounded-3xl p-5 space-y-3">
                        <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-[#1DC9A4]" />
                            <span className="text-xs font-bold text-[#1DC9A4] uppercase tracking-widest">Arooska</span>
                        </div>
                        <h2 className="text-xl font-black text-white">
                            {wedding.groom_name} & {wedding.bride_name}
                        </h2>
                        <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-[#1DC9A4]" />
                                <span>{wedding.venue}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3 h-3 text-[#1DC9A4]" />
                                <span>{new Date(wedding.wedding_date).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                            <span className="text-slate-400 text-sm">Sooryo Lacagta</span>
                            <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4 text-[#1DC9A4]" />
                                <span className="text-2xl font-black text-white">{qr?.amount?.toFixed(0)}</span>
                                <span className="text-slate-500 text-xs">USD</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Form */}
                <form onSubmit={handlePay} className="bg-[#0D1F35] border border-[#1A2F6B]/50 rounded-3xl p-5 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                        <CreditCard className="w-4 h-4 text-[#1DC9A4]" />
                        <span className="text-sm font-bold text-white">Lacag Bixinta Sooryadaada</span>
                    </div>

                    {/* Payer Name */}
                    <div className="space-y-1.5">
                        <label className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                            <User className="w-3 h-3" /> Magacaaga
                        </label>
                        <input
                            type="text"
                            value={payerName}
                            onChange={e => setPayerName(e.target.value)}
                            placeholder="Magacaaga oo buuxa"
                            className="w-full bg-[#0A1628] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#1DC9A4] transition placeholder:text-slate-600"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                        <label className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                            <Phone className="w-3 h-3" /> Lambarka Telefoonka
                        </label>
                        <input
                            type="tel"
                            value={payerPhone}
                            onChange={e => setPayerPhone(e.target.value)}
                            placeholder="+252 61 XXX XXXX"
                            className="w-full bg-[#0A1628] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#1DC9A4] transition placeholder:text-slate-600"
                            required
                        />
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-semibold">Habka Lacag Bixinta</label>
                        <div className="grid grid-cols-2 gap-2">
                            {(['EVC Plus', 'ZAAD', 'Sahal', 'Premier Bank'] as PaymentMethod[]).map(m => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => setMethod(m)}
                                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${method === m
                                        ? 'bg-[#1DC9A4] border-[#1DC9A4] text-[#0A1628]'
                                        : 'bg-[#0A1628] border-slate-700 text-slate-400 hover:border-[#1DC9A4]/50'
                                        }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={step === 'processing'}
                        className="w-full py-4 rounded-2xl font-black text-sm bg-gradient-to-r from-[#1DC9A4] to-[#15A88A] text-[#0A1628] hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {step === 'processing' ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Lacagta Waxaa La Dirayo...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Bixi Sooryo — ${qr?.amount?.toFixed(0)} USD
                            </>
                        )}
                    </button>
                </form>

                {/* QR ID */}
                <p className="text-center text-xs text-slate-700 font-mono">{qrId}</p>
            </div>
        </div>
    );
}
