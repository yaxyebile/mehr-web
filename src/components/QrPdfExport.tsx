'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Wedding } from '@/lib/types';
import { Printer, Download, Sparkles } from 'lucide-react';

interface QrPdfExportProps {
    wedding: Wedding;
    qrCodes: QrCode[];
    onClose: () => void;
}

export default function QrPdfExport({ wedding, qrCodes, onClose }: QrPdfExportProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md p-4 sm:p-6 flex flex-col items-center">

            {/* Top Floating Controls */}
            <div className="sticky top-4 z-10 w-full max-w-4xl bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 shadow-2xl flex items-center justify-between mb-6 print:hidden">
                <div>
                    <h3 className="font-bold text-sm text-white">Printable Guest QR Cards</h3>
                    <p className="text-xs text-slate-400">
                        {wedding.groom_name} & {wedding.bride_name} Wedding • Total {qrCodes.length} Guests
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
                    >
                        <Printer className="w-4 h-4" /> Print / Save PDF
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                    >
                        Close
                    </button>
                </div>
            </div>

            {/* Printable Sheet Grid */}
            <div className="w-full max-w-4xl bg-white text-slate-900 p-8 rounded-2xl shadow-2xl space-y-8 print:p-0 print:shadow-none print:bg-transparent">

                {/* Printable Header */}
                <div className="border-b-2 border-emerald-900 pb-4 text-center">
                    <h1 className="text-2xl font-black tracking-wider text-emerald-950 uppercase">
                        MEHER PAY — GUEST PASS CARDS
                    </h1>
                    <p className="text-sm font-semibold text-amber-700 mt-1">
                        {wedding.groom_name} & {wedding.bride_name} Wedding • {wedding.venue}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Present this QR code to the Door Usher for instant digital Sooryo entry.
                    </p>
                </div>

                {/* QR Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {qrCodes.map((qr, idx) => (
                        <div
                            key={qr.id}
                            className="border-2 border-slate-300 rounded-xl p-3 flex flex-col items-center justify-between text-center bg-slate-50 break-inside-avoid"
                        >
                            <div className="w-full border-b border-slate-200 pb-1.5 mb-2 flex justify-between items-center text-[10px] font-bold text-slate-600">
                                <span>PASS #{idx + 1}</span>
                                <span className="text-emerald-700 font-mono">{qr.qr_code_id}</span>
                            </div>

                            <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm mb-2">
                                <QRCodeSVG
                                    value={qr.qr_code_id}
                                    size={110}
                                    level="H"
                                    includeMargin={false}
                                />
                            </div>

                            <div className="text-[11px] font-bold text-slate-900">
                                Sooryo Gift: ${qr.amount} USD
                            </div>
                            <span className="text-[9px] text-slate-500 block mt-0.5">
                                Scan via EVC Plus / ZAAD at Gate
                            </span>
                        </div>
                    ))}
                </div>

            </div>

        </div>
    );
}
