'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, QrCode, Sparkles, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

interface WebcamScannerProps {
    onScanResult: (decodedText: string) => void;
    isProcessing?: boolean;
}

export default function WebcamScanner({ onScanResult, isProcessing }: WebcamScannerProps) {
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [manualCode, setManualCode] = useState('');
    const [cameraError, setCameraError] = useState<string | null>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const qrRegionId = 'html5qr-code-full-region';

    const startCamera = async () => {
        setCameraError(null);
        try {
            if (!scannerRef.current) {
                scannerRef.current = new Html5Qrcode(qrRegionId);
            }

            const devices = await Html5Qrcode.getCameras();
            if (devices && devices.length > 0) {
                const cameraId = devices[0].id;
                await scannerRef.current.start(
                    cameraId,
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                    },
                    (decodedText) => {
                        onScanResult(decodedText);
                        stopCamera();
                    },
                    (errorMessage) => {
                        // Ignore scan failure noise
                    }
                );
                setIsCameraActive(true);
            } else {
                setCameraError('No camera found on this device. Use manual code entry below.');
            }
        } catch (err: any) {
            console.error('Camera init error:', err);
            setCameraError(err.message || 'Camera permission denied or camera unavailable.');
        }
    };

    const stopCamera = async () => {
        if (scannerRef.current && isCameraActive) {
            try {
                await scannerRef.current.stop();
                setIsCameraActive(false);
            } catch (err) {
                console.error('Error stopping camera:', err);
            }
        }
    };

    useEffect(() => {
        return () => {
            if (scannerRef.current && isCameraActive) {
                scannerRef.current.stop().catch(console.error);
            }
        };
    }, [isCameraActive]);

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualCode.trim()) {
            onScanResult(manualCode.trim());
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-500/30">
                        <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-white">Guest QR Door Verification</h3>
                        <p className="text-[11px] text-slate-400">Scan QR pass or enter code manually</p>
                    </div>
                </div>

                <button
                    onClick={isCameraActive ? stopCamera : startCamera}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-md ${isCameraActive
                            ? 'bg-rose-500 hover:bg-rose-600 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                >
                    {isCameraActive ? (
                        <>
                            <CameraOff className="w-3.5 h-3.5" /> Stop Camera
                        </>
                    ) : (
                        <>
                            <Camera className="w-3.5 h-3.5" /> Open Webcam
                        </>
                    )}
                </button>
            </div>

            {/* Camera View Area */}
            <div className="relative w-full h-64 bg-slate-950 rounded-2xl border-2 border-dashed border-emerald-800/60 overflow-hidden flex items-center justify-center mb-5">
                <div id={qrRegionId} className="w-full h-full" />

                {!isCameraActive && (
                    <div className="text-center p-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-3 animate-float">
                            <QrCode className="w-7 h-7" />
                        </div>
                        <p className="text-xs font-semibold text-slate-300">Camera is currently standby</p>
                        <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                            Click &quot;Open Webcam&quot; above to enable live QR scanning or select a test code below.
                        </p>
                    </div>
                )}

                {cameraError && (
                    <div className="absolute inset-0 bg-slate-950/90 p-4 flex flex-col items-center justify-center text-center">
                        <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
                        <p className="text-xs text-slate-300">{cameraError}</p>
                    </div>
                )}
            </div>

            {/* Manual Code Input Form */}
            <form onSubmit={handleManualSubmit} className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                    Manual Code / Card Lookup
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        placeholder="e.g. MHR-WED1-GUEST-001"
                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-900/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 uppercase tracking-widest font-mono"
                    />
                    <button
                        type="submit"
                        disabled={!manualCode.trim() || isProcessing}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md"
                    >
                        {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Verify
                    </button>
                </div>
            </form>

            {/* Quick Demo Test QR Pills */}
            <div className="mt-4 pt-4 border-t border-slate-800">
                <p className="text-[11px] font-semibold text-amber-400 mb-2">Quick Usher Demo Scans:</p>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => onScanResult('MHR-WED1-GUEST-001')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-500/40 text-[11px] font-mono text-emerald-300 hover:bg-emerald-900 transition"
                    >
                        MHR-WED1-GUEST-001 (Sumaya & Farhan)
                    </button>
                    <button
                        onClick={() => onScanResult('MHR-WED2-GUEST-001')}
                        className="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-500/40 text-[11px] font-mono text-cyan-300 hover:bg-cyan-900 transition"
                    >
                        MHR-WED2-GUEST-001 (Hodhan & Khadar)
                    </button>
                    <button
                        onClick={() => onScanResult('MHR-WED1-GUEST-002')}
                        className="px-2.5 py-1 rounded-lg bg-amber-950 border border-amber-500/40 text-[11px] font-mono text-amber-300 hover:bg-amber-900 transition"
                    >
                        MHR-WED1-GUEST-002
                    </button>
                </div>
            </div>
        </div>
    );
}
