'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import StatCard from '@/components/StatCard';
import { useMeherStore } from '@/lib/store';
import {
    DollarSign,
    Building2,
    ShieldCheck,
    CreditCard,
    Crown,
    TrendingUp,
    Wallet,
    Users,
    Activity,
    ArrowUpRight,
    Sparkles
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

export default function OwnerOverviewPage() {
    const [mobileSidebar, setMobileSidebar] = useState(false);
    const { transactions, weddings, users, paymentProviders } = useMeherStore();

    const totalProcessed = transactions.reduce((sum, t) => sum + (t.status === 'SUCCESS' ? t.amount : 0), 0);
    const totalServiceFeeEarnings = totalProcessed * 0.05; // 5% service fee
    const activeWeddingsCount = weddings.filter((w) => w.status === 'active').length;
    const adminCount = users.filter((u) => u.role === 'admin').length;

    // Chart data for revenue trend
    const revenueChartData = [
        { day: 'Mon', revenue: 1200, fee: 60 },
        { day: 'Tue', revenue: 1850, fee: 92.5 },
        { day: 'Wed', revenue: 2400, fee: 120 },
        { day: 'Thu', revenue: 3100, fee: 155 },
        { day: 'Fri', revenue: 4600, fee: 230 },
        { day: 'Sat', revenue: 7200, fee: 360 },
        { day: 'Today', revenue: totalProcessed, fee: totalServiceFeeEarnings },
    ];

    // Provider distribution chart
    const providerData = [
        { name: 'Hormuud EVC Plus', value: 48, color: '#10b981' },
        { name: 'Telesom ZAAD', value: 32, color: '#f59e0b' },
        { name: 'Golis Sahal', value: 12, color: '#06b6d4' },
        { name: 'Premier Bank', value: 8, color: '#a855f7' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar onToggleMobileSidebar={() => setMobileSidebar(!mobileSidebar)} />

            <div className="flex-1 flex">
                <Sidebar mobileOpen={mobileSidebar} onCloseMobile={() => setMobileSidebar(false)} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">

                    {/* Header Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950/40 border border-amber-500/30 shadow-2xl">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
                                <Crown className="w-3.5 h-3.5 text-amber-400" /> Executive Owner Portal
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-white">
                                Platform Revenue & Financial Overview
                            </h1>
                            <p className="text-xs text-slate-400 mt-1">
                                Real-time monitoring of total processed Sooryo, platform service fee earnings, and active payment gateways.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-emerald-500/40 text-right">
                                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Platform Net Commission (5%)</span>
                                <span className="text-xl font-extrabold gold-text-gradient">${totalServiceFeeEarnings.toFixed(2)} USD</span>
                            </div>
                        </div>
                    </div>

                    {/* Stat Cards Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <StatCard
                            title="Total Processed Revenue"
                            value={`$${totalProcessed.toLocaleString()} USD`}
                            subtitle="Via EVC, ZAAD, Sahal & Bank"
                            icon={Wallet}
                            variant="gold"
                            pulse
                            trend={{ value: '+24.8% this week', isPositive: true }}
                        />

                        <StatCard
                            title="Service Fee Earnings"
                            value={`$${totalServiceFeeEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                            subtitle="5% platform cut"
                            icon={DollarSign}
                            variant="emerald"
                            trend={{ value: '+$460 today', isPositive: true }}
                        />

                        <StatCard
                            title="Active Weddings"
                            value={activeWeddingsCount}
                            subtitle="Across Mogadishu, Hargeisa, Garowe"
                            icon={Building2}
                            variant="cyan"
                        />

                        <StatCard
                            title="Operational Admins"
                            value={adminCount}
                            subtitle="Regional ops staff"
                            icon={Users}
                            variant="purple"
                        />
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Revenue Trend Area Chart */}
                        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="font-extrabold text-base text-white">Sooryo Revenue & Service Fee Trajectory</h3>
                                    <p className="text-xs text-slate-400">Weekly growth trajectory across all registered weddings</p>
                                </div>

                            </div>

                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueChartData}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorFee" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#20c997" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#20c997" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                        <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                                        <YAxis stroke="#64748b" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#0F5132', borderRadius: '12px', fontSize: '12px' }}
                                        />
                                        <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Total Revenue ($)" />
                                        <Area type="monotone" dataKey="fee" stroke="#20c997" strokeWidth={2} fillOpacity={1} fill="url(#colorFee)" name="Platform Fee ($)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Provider Volume Pie Chart */}
                        <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md shadow-2xl flex flex-col justify-between">
                            <div>
                                <h3 className="font-extrabold text-base text-white">Payment Method Distribution</h3>
                                <p className="text-xs text-slate-400">Share by volume across Somaliland & Somalia</p>
                            </div>

                            <div className="h-56 w-full my-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={providerData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {providerData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="space-y-2">
                                {providerData.map((item) => (
                                    <div key={item.name} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-slate-300 font-medium">{item.name}</span>
                                        </div>
                                        <span className="font-bold text-white">{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Recent Global Transactions Feed */}
                    <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-extrabold text-base text-white">Live Platform Transactions Feed</h3>
                                <p className="text-xs text-slate-400">Real-time payments coming in from door usher scanner gates</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="py-3 px-4">Transaction ID</th>
                                        <th className="py-3 px-4">Wedding Event</th>
                                        <th className="py-3 px-4">Payer Details</th>
                                        <th className="py-3 px-4">Method & Provider</th>
                                        <th className="py-3 px-4 text-right">Amount</th>
                                        <th className="py-3 px-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 text-xs">
                                    {transactions.slice(0, 5).map((t) => (
                                        <tr key={t.id} className="hover:bg-slate-800/40 transition">
                                            <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">{t.transaction_id}</td>
                                            <td className="py-3.5 px-4 font-medium text-white">{t.wedding_title}</td>
                                            <td className="py-3.5 px-4">
                                                <p className="text-slate-200 font-medium">{t.payer_name}</p>
                                                <p className="text-[10px] text-slate-500 font-mono">{t.payer_phone}</p>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="inline-flex items-center gap-1.5 font-bold text-amber-400">
                                                    <CreditCard className="w-3.5 h-3.5" /> {t.payment_method}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right font-extrabold text-white">${t.amount}.00</td>
                                            <td className="py-3.5 px-4 text-center">
                                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                    {t.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}
