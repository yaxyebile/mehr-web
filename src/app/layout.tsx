import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Meher Pay — Digital Wedding Sooryo & Payment Platform",
    description: "Next.js Web Platform for Meher Pay: Digital Wedding Sooryo collection, QR usher gate, and multi-provider payment ecosystem across Somalia & Somaliland.",
    keywords: ["Meher Pay", "Sooryo", "Somali Wedding", "EVC Plus", "ZAAD", "Next.js", "Supabase"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
                {children}
            </body>
        </html>
    );
}
