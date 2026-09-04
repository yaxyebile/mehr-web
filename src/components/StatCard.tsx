'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    variant?: 'gold' | 'emerald' | 'cyan' | 'purple';
    pulse?: boolean;
}

export default function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    variant = 'emerald',
    pulse = false,
}: StatCardProps) {
    const getVariantStyles = () => {
        switch (variant) {
            case 'gold':
                return {
                    border: 'border-amber-500/30 hover:border-amber-500/60',
                    iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                    glow: 'gold-glow',
                    text: 'text-amber-400',
                };
            case 'cyan':
                return {
                    border: 'border-cyan-500/30 hover:border-cyan-500/60',
                    iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
                    glow: 'shadow-cyan-500/20',
                    text: 'text-cyan-400',
                };
            case 'purple':
                return {
                    border: 'border-purple-500/30 hover:border-purple-500/60',
                    iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
                    glow: 'shadow-purple-500/20',
                    text: 'text-purple-400',
                };
            default:
                return {
                    border: 'border-emerald-500/30 hover:border-emerald-500/60',
                    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                    glow: 'emerald-glow',
                    text: 'text-emerald-400',
                };
        }
    };

    const styles = getVariantStyles();

    return (
        <div
            className={`relative overflow-hidden rounded-2xl bg-slate-900/80 backdrop-blur-md p-5 border ${styles.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${styles.glow} group`}
        >
            {/* Background Subtle Gradient */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-emerald-500/5 group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                    {title}
                </span>
                <div className={`p-2.5 rounded-xl border ${styles.iconBg} relative`}>
                    <Icon className="w-5 h-5" />
                    {pulse && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                    )}
                </div>
            </div>

            <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
                    {value}
                </div>

                <div className="mt-2 flex items-center justify-between text-xs">
                    {subtitle && <span className="text-slate-400">{subtitle}</span>}

                    {trend && (
                        <span
                            className={`inline-flex items-center gap-1 font-semibold ${trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
                                }`}
                        >
                            {trend.isPositive ? (
                                <TrendingUp className="w-3.5 h-3.5" />
                            ) : (
                                <TrendingDown className="w-3.5 h-3.5" />)}
                            {trend.value}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
