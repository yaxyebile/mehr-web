import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                emerald: {
                    950: "#062013",
                    900: "#0F5132",
                    800: "#146c43",
                    700: "#198754",
                    500: "#20c997",
                    400: "#34d399",
                },
                gold: {
                    300: "#fde047",
                    400: "#facc15",
                    500: "#D4AF37",
                    600: "#b49020",
                    700: "#8c6d13",
                },
            },
            backgroundImage: {
                'emerald-gold-gradient': 'linear-gradient(135deg, #0F5132 0%, #146c43 50%, #D4AF37 100%)',
                'glass-card': 'radial-gradient(100% 100% at 0% 0%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 15px rgba(212, 175, 55, 0.2)' },
                    '100%': { boxShadow: '0 0 30px rgba(212, 175, 55, 0.6)' },
                }
            }
        },
    },
    plugins: [],
};
export default config;
