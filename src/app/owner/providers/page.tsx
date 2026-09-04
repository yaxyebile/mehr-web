'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useMeherStore } from '@/lib/store';
import { PaymentProvider } from '@/lib/types';
import {
    CreditCard,
    ShieldCheck,
    Settings,
    ToggleLeft,
    ToggleRight,
    CheckCircle2,
    AlertTriangle,
    ExternalLink,
    Edit2,
    Sparkles,
    Smartphone
} from 'lucide-react';

export default function PaymentProvidersPage() {
    const [mobileSidebar, setMobileSidebar] = useState(false);
    const { paymentProviders, toggleProviderStatus, toggleProviderTestMode, updateProviderConfig } = useMeherStore();

    const [editingProvider, setEditingProvider] = useState<PaymentProvider | null>(null);
    const [merchantId, setMerchantId] = useState('');
    const [apiEndpoint, setApiEndpoint] = useState('');

    const openEditModal = (provider: PaymentProvider) => {
        setEditingProvider(provider);
        setMerchantId(provider.merchant_id);
        setApiEndpoint(provider.api_endpoint);
    };

    const handleSaveConfig = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProvider) {
            updateProviderConfig(editingProvider.id, merchantId, apiEndpoint);
            setEditingProvider(null);
        }
    };

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
                                Payment Integration Engine
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                                Payment Provider Gateways
                            </h1>
                            <p className="text-xs text-slate-400 mt-1">
                                Configure API endpoints, merchant identifiers, and test vs production modes for EVC Plus, ZAAD, Sahal, Premier Bank, and Credit Cards.
                            </p>
                        </div>
                    </div>

                    {/* Providers Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paymentProviders.map((provider) => (
                            <div
                                key={provider.id}
                                className={`p-6 rounded-3xl bg-slate-900/90 border backdrop-blur-md shadow-2xl flex flex-col justify-between transition-all ${provider.status === 'active' ? 'border-emerald-500/40' : 'border-slate-800 opacity-60'
                                    }`}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-extrabold text-base text-white">{provider.name}</h3>
                                                <span className="text-[10px] font-mono text-emerald-400 uppercase">{provider.code}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => toggleProviderStatus(provider.id)}
                                            className="text-slate-300 hover:text-white"
                                            title="Toggle Active Status"
                                        >
                                            {provider.status === 'active' ? (
                                                <ToggleRight className="w-8 h-8 text-emerald-400" />
                                            ) : (
                                                <ToggleLeft className="w-8 h-8 text-slate-600" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Mode Badge & Config Info */}
                                    <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400">Environment Mode:</span>
                                            <button
                                                onClick={() => toggleProviderTestMode(provider.id)}
                                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border transition ${provider.is_test_mode
                                                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                                    }`}
                                            >
                                                {provider.is_test_mode ? 'SANDBOX TEST MODE' : 'LIVE PRODUCTION'}
                                            </button>
                                        </div>

                                        <div>
                                            <span className="text-slate-500 text-[10px] uppercase font-bold block">Merchant Account ID</span>
                                            <span className="font-mono text-white font-semibold">{provider.merchant_id}</span>
                                        </div>

                                        <div>
                                            <span className="text-slate-500 text-[10px] uppercase font-bold block">API Endpoint</span>
                                            <span className="font-mono text-slate-300 text-[11px] truncate block">{provider.api_endpoint}</span>
                                        </div>

                                        <div className="flex items-center gap-1.5 pt-1">
                                            <span className="text-slate-400 text-[11px]">Currencies:</span>
                                            <div className="flex gap-1">
                                                {provider.supported_currencies.map((c) => (
                                                    <span key={c} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-amber-300">
                                                        {c}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Edit Config Button */}
                                <div className="mt-5 pt-4 border-t border-slate-800">
                                    <button
                                        onClick={() => openEditModal(provider)}
                                        className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition flex items-center justify-center gap-2"
                                    >
                                        <Edit2 className="w-3.5 h-3.5 text-amber-400" /> Edit Gateway Configuration
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>

                    {/* Edit Gateway Modal */}
                    {editingProvider && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                            <div className="w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <h3 className="font-extrabold text-base text-white">Configure {editingProvider.name}</h3>
                                    <button onClick={() => setEditingProvider(null)} className="text-slate-400 hover:text-white">
                                        ✕
                                    </button>
                                </div>

                                <form onSubmit={handleSaveConfig} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1">Merchant Account ID / Key</label>
                                        <input
                                            type="text"
                                            required
                                            value={merchantId}
                                            onChange={(e) => setMerchantId(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:border-amber-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1">Gateway API Endpoint</label>
                                        <input
                                            type="url"
                                            required
                                            value={apiEndpoint}
                                            onChange={(e) => setApiEndpoint(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:border-amber-500"
                                        />
                                    </div>

                                    <div className="pt-2 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setEditingProvider(null)}
                                            className="w-1/3 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-md"
                                        >
                                            Save Configuration
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}
