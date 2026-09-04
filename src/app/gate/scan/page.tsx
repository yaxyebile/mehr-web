'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import WebcamScanner from '@/components/WebcamScanner';
import PaymentModal from '@/components/PaymentModal';
import { useMeherStore } from '@/lib/store';
import { QrCode, Transaction } from '@/lib/types';
import {
    QrCode as QrIcon,
    CheckCircle2,
    AlertCircle,
    Sparkles,
    Printer,
    Activity,
    History,
    ShieldCheck,
    CreditCard,
    Building2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PublicDoorUsherGatePage() {
    const { qrCodes, transactions, weddings, initRealtime } = useMeherStore();

    useEffect(() => {
        initRealtime();
    }, [initRealtime]);

    const [activeQr, setActiveQr] = useState<QrCode | null>(null);
    const [scanMessage, setScanMessage] = useState<{ type: 'error' | 'warning' | 'info'; text: string } | null>(null);
    const [lastProcessedTxn, setLastProcessedTxn] = useState<Transaction | null>(null);

    const handleScanResult = (scannedCode: string) => {
        setScanMessage(null);
        const cleanCode = scannedCode.trim();

        // Find QR code in store
        const foundQr = qrCodes.find((q) => q.qr_code_id === cleanCode || q.id === cleanCode);

        if (!foundQr) {
            setScanMessage({
                type: 'error',
                text: `Invalid or unrecognized QR code "${cleanCode}". Please check pass card.`,
            });
            return;
        }

        if (foundQr.status === 'USED') {
            setScanMessage({
                type: 'warning',
                text: `QR Code ${foundQr.qr_code_id} HAS ALREADY BEEN USED! Scanned at ${foundQr.used_at ? new Date(foundQr.used_at).toLocaleTimeString() : 'earlier'}.`,
            });
            return;
        }

        // Active QR found! Open payment verification modal
        setActiveQr(foundQr);
    };

    const handlePaymentSuccess = (txn: Transaction) => {
        setLastProcessedTxn(txn);
        setActiveQr(null);
        setScanMessage({
            type: 'info',
            text: `Payment Successful! Receipt #${txn.receipt_number} generated for ${txn.payer_name} ($${txn.amount} USD).`,
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar />

            <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto w-full">

                {/* Entrance Gate Header */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-emerald-950 border border-purple-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-2">
                            <QrIcon className="w-3.5 h-3.5 text-purple-400" /> Public Usher Entrance Gate
                        </div>
                        <h1 className="text-3xl font-black text-white">Live Guest Entry & Sooryo Scanner</h1>
                        <p className="text-xs text-slate-300 mt-1">
                            No-login entrance gate for door ushers. Scans webcam QR codes, processes instant EVC Plus / ZAAD payments, and broadcasts live to Supabase.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 border border-emerald-500/40 text-xs font-semibold text-emerald-300">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                        Supabase Live Gate Active
                    </div>
                </div>

                {/* Scan Message Alert */}
                {scanMessage && (
                    <div
                        className={`p-4 rounded-2xl border text-xs flex items-center gap-3 animate-in fade-in ${scanMessage.type === 'error'
                                ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                                : scanMessage.type === 'warning'
                                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                                    : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                            }`}
                    >
                        {scanMessage.type === 'error' ? (
                            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                        ) : scanMessage.type === 'warning' ? (
                            <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
                        ) : (
                            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                        )}
                        <span className="font-semibold">{scanMessage.text}</span>
                    </div>
                )}

                {/* Scanner & Recent Scans Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Main Webcam Scanner */}
                    <div className="lg:col-span-7">
                        <WebcamScanner onScanResult={handleScanResult} />
                    </div>

                    {/* Recent Live Usher Scans Sidebar */}
                    <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-md shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <History className="w-4 h-4 text-amber-400" />
                                <h3 className="font-extrabold text-sm text-white">Recent Door Entrance Scans</h3>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                                Live Feed
                            </span>
                        </div>

                        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                            {transactions.slice(0, 8).map((txn) => (
                                <div
                                    key={txn.id}
                                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition text-xs space-y-1"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-white">{txn.payer_name}</span>
                                        <span className="font-extrabold gold-text-gradient">${txn.amount}.00</span>
                                    </div>

                                    <div className="flex items-center justify-between text-[11px]">
                                        <span className="text-emerald-400 font-mono font-semibold">{txn.receipt_number}</span>
                                        <span className="text-slate-400">{txn.payment_method}</span>
                                    </div>

                                    <div className="text-[10px] text-slate-500 flex justify-between pt-1 border-t border-slate-900">
                                        <span>{txn.wedding_title}</span>
                                        <span className="font-mono">{new Date(txn.created_at).toLocaleTimeString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Modal Dialog for Payment Trigger */}
                {activeQr && (
                    <PaymentModal
                        qrCode={activeQr}
                        onClose={() => setActiveQr(null)}
                        onSuccess={handlePaymentSuccess}
                    />
                )}

            </main>
        </div>
    );
}
