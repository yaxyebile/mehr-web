'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import QrPdfExport from '@/components/QrPdfExport';
import { useMeherStore } from '@/lib/store';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode as QrIcon, Printer, Download, Search, Filter, CheckCircle2, Clock } from 'lucide-react';

export default function GuestQrManagerPage() {
    const [mobileSidebar, setMobileSidebar] = useState(false);
    const { weddings, qrCodes, currentUser } = useMeherStore();

    const wedding = weddings.find((w) => w.owner_id === currentUser?.id) || weddings[0];
    const weddingQrs = qrCodes.filter((q) => q.wedding_id === wedding?.id);

    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showPrintModal, setShowPrintModal] = useState(false);

    const filteredQrs = weddingQrs.filter((q) => {
        const matchesStatus = filterStatus === 'all' || q.status === filterStatus;
        const matchesSearch = q.qr_code_id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const activeCount = weddingQrs.filter((q) => q.status === 'ACTIVE').length;
    const usedCount = weddingQrs.filter((q) => q.status === 'USED').length;

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
                                Guest Entrance Passes ({weddingQrs.length} Total)
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                                Guest QR Code Package Manager
                            </h1>
                            <p className="text-xs text-slate-400 mt-1">
                                Manage, search, and batch-print high-resolution QR pass cards for door usher scanning.
                            </p>
                        </div>

                        <button
                            onClick={() => setShowPrintModal(true)}
                            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-lg flex items-center gap-2"
                        >
                            <Printer className="w-4 h-4" /> Download Printable PDF Cards
                        </button>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full sm:w-80">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search QR code ID (e.g. GUEST-001)..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                            />
                        </div>

                        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-3 py-1.5 rounded-xl font-bold transition ${filterStatus === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                All ({weddingQrs.length})
                            </button>
                            <button
                                onClick={() => setFilterStatus('ACTIVE')}
                                className={`px-3 py-1.5 rounded-xl font-bold transition ${filterStatus === 'ACTIVE' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                Active ({activeCount})
                            </button>
                            <button
                                onClick={() => setFilterStatus('USED')}
                                className={`px-3 py-1.5 rounded-xl font-bold transition ${filterStatus === 'USED' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                Scanned / Paid ({usedCount})
                            </button>
                        </div>
                    </div>

                    {/* QR Cards Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {filteredQrs.slice(0, 48).map((qr) => (
                            <div
                                key={qr.id}
                                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-between text-center transition ${qr.status === 'USED'
                                        ? 'bg-purple-950/30 border-purple-500/40 opacity-75'
                                        : 'bg-slate-900 border-slate-800 hover:border-emerald-500/50'
                                    }`}
                            >
                                <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
                                    <span className="truncate">{qr.qr_code_id.slice(-9)}</span>
                                    <span
                                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${qr.status === 'USED' ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300'
                                            }`}
                                    >
                                        {qr.status}
                                    </span>
                                </div>

                                <div className="p-2 bg-white rounded-xl mb-2 shadow-sm">
                                    <QRCodeSVG value={qr.qr_code_id} size={90} level="M" />
                                </div>

                                <span className="text-[11px] font-bold text-amber-400">${qr.amount} USD</span>
                            </div>
                        ))}
                    </div>

                    {/* Printable Modal Exporter */}
                    {showPrintModal && wedding && (
                        <QrPdfExport
                            wedding={wedding}
                            qrCodes={weddingQrs}
                            onClose={() => setShowPrintModal(false)}
                        />
                    )}

                </main>
            </div>
        </div>
    );
}
