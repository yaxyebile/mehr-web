import { create } from 'zustand';
import { User, Wedding, QrCode, Transaction, PaymentProvider, AuditLog, PayoutRequest, UserRole } from './types';
import { INITIAL_USERS, INITIAL_WEDDINGS, INITIAL_PAYMENT_PROVIDERS, generateSeedQrCodes, INITIAL_TRANSACTIONS, INITIAL_AUDIT_LOGS, INITIAL_PAYOUTS } from './mockData';
import { supabase } from './supabase';

interface MeherState {
    currentUser: User | null;
    users: User[];
    weddings: Wedding[];
    qrCodes: QrCode[];
    transactions: Transaction[];
    paymentProviders: PaymentProvider[];
    auditLogs: AuditLog[];
    payouts: PayoutRequest[];
    theme: 'dark' | 'light';
    isRealtimeConnected: boolean;

    // Actions
    setCurrentUser: (user: User | null) => void;
    setTheme: (theme: 'dark' | 'light') => void;
    toggleTheme: () => void;

    // Data Mutators
    addWedding: (wedding: Omit<Wedding, 'id' | 'created_at'>) => Wedding;
    updateWeddingStatus: (id: string, status: Wedding['status']) => void;

    addAdminUser: (admin: { full_name: string; email: string; phone: string }) => void;
    updateUserStatus: (id: string, status: User['status']) => void;

    toggleProviderStatus: (id: string) => void;
    toggleProviderTestMode: (id: string) => void;
    updateProviderConfig: (id: string, merchant_id: string, api_endpoint: string) => void;

    processGatePayment: (params: {
        qrCode: QrCode;
        payer_name: string;
        payer_phone: string;
        amount: number;
        payment_method: Transaction['payment_method'];
    }) => Promise<Transaction>;

    requestPayout: (weddingId: string, amount: number, method: Transaction['payment_method'], account: string) => void;

    logAudit: (action: string, details: string) => void;

    // Initialize Realtime Supabase Sync
    initRealtime: () => void;
}

export const useMeherStore = create<MeherState>((set, get) => ({
    currentUser: INITIAL_USERS[0], // Default logged in as Platform Owner for quick developer preview, easy role switcher included!
    users: INITIAL_USERS,
    weddings: INITIAL_WEDDINGS,
    qrCodes: generateSeedQrCodes(),
    transactions: INITIAL_TRANSACTIONS,
    paymentProviders: INITIAL_PAYMENT_PROVIDERS,
    auditLogs: INITIAL_AUDIT_LOGS,
    payouts: INITIAL_PAYOUTS,
    theme: 'dark',
    isRealtimeConnected: false,

    setCurrentUser: (user) => set({ currentUser: user }),

    setTheme: (theme) => set({ theme }),

    toggleTheme: () => set((state) => {
        const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
        if (typeof document !== 'undefined') {
            if (nextTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
        return { theme: nextTheme };
    }),

    addWedding: (newWeddingData) => {
        const id = `wed-${Date.now()}`;
        const newWedding: Wedding = {
            ...newWeddingData,
            id,
            created_at: new Date().toISOString(),
        };

        // Auto-generate guest QR codes for this wedding
        const newQrs: QrCode[] = [];
        for (let i = 1; i <= newWedding.guest_count; i++) {
            const padNum = String(i).padStart(3, '0');
            newQrs.push({
                id: `qr-${id}-${padNum}`,
                qr_code_id: `MHR-${id.toUpperCase()}-GUEST-${padNum}`,
                wedding_id: id,
                status: 'ACTIVE',
                amount: newWedding.sooryo_amount_per_person,
                created_at: new Date().toISOString(),
            });
        }

        set((state) => ({
            weddings: [newWedding, ...state.weddings],
            qrCodes: [...newQrs, ...state.qrCodes],
        }));

        get().logAudit('WEDDING_CREATED', `Registered new wedding for ${newWedding.bride_name} & ${newWedding.groom_name} at ${newWedding.venue}`);

        // Sync to Supabase in background
        supabase.from('weddings').insert([{
            id: newWedding.id,
            owner_id: newWedding.owner_id,
            bride_name: newWedding.bride_name,
            groom_name: newWedding.groom_name,
            wedding_date: newWedding.wedding_date,
            venue: newWedding.venue,
            guest_count: newWedding.guest_count,
            sooryo_amount_per_person: newWedding.sooryo_amount_per_person,
            expected_amount: newWedding.expected_amount,
            service_fee: newWedding.service_fee,
            status: newWedding.status,
            created_at: newWedding.created_at,
        }]).then(() => { });

        return newWedding;
    },

    updateWeddingStatus: (id, status) => {
        set((state) => ({
            weddings: state.weddings.map((w) => (w.id === id ? { ...w, status } : w)),
        }));
        get().logAudit('WEDDING_STATUS_UPDATED', `Updated wedding ${id} status to ${status.toUpperCase()}`);
        supabase.from('weddings').update({ status }).eq('id', id).then(() => { });
    },

    addAdminUser: (adminData) => {
        const newUser: User = {
            id: `usr-admin-${Date.now()}`,
            full_name: adminData.full_name,
            email: adminData.email,
            phone: adminData.phone,
            role: 'admin',
            status: 'active',
            created_at: new Date().toISOString(),
        };
        set((state) => ({ users: [newUser, ...state.users] }));
        get().logAudit('ADMIN_CREATED', `Created new operational admin account for ${newUser.full_name} (${newUser.email})`);
        supabase.from('users').insert([newUser]).then(() => { });
    },

    updateUserStatus: (id, status) => {
        set((state) => ({
            users: state.users.map((u) => (u.id === id ? { ...u, status } : u)),
        }));
        get().logAudit('USER_STATUS_UPDATED', `Updated user ${id} status to ${status.toUpperCase()}`);
        supabase.from('users').update({ status }).eq('id', id).then(() => { });
    },

    toggleProviderStatus: (id) => {
        set((state) => ({
            paymentProviders: state.paymentProviders.map((p) =>
                p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
            ),
        }));
        get().logAudit('PROVIDER_TOGGLED', `Toggled payment provider ${id} active status`);
    },

    toggleProviderTestMode: (id) => {
        set((state) => ({
            paymentProviders: state.paymentProviders.map((p) =>
                p.id === id ? { ...p, is_test_mode: !p.is_test_mode } : p
            ),
        }));
        get().logAudit('PROVIDER_TEST_MODE_TOGGLED', `Toggled test/production mode for payment provider ${id}`);
    },

    updateProviderConfig: (id, merchant_id, api_endpoint) => {
        set((state) => ({
            paymentProviders: state.paymentProviders.map((p) =>
                p.id === id ? { ...p, merchant_id, api_endpoint, is_configured: true } : p
            ),
        }));
        get().logAudit('PROVIDER_CONFIG_UPDATED', `Updated API endpoint & Merchant ID for provider ${id}`);
    },

    processGatePayment: async ({ qrCode, payer_name, payer_phone, amount, payment_method }) => {
        const wedding = get().weddings.find((w) => w.id === qrCode.wedding_id);
        const weddingTitle = wedding ? `${wedding.groom_name} & ${wedding.bride_name} Wedding` : 'Wedding Sooryo';
        const txnId = `TXN-${Date.now().toString().slice(-6)}`;
        const receiptNum = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        const newTxn: Transaction = {
            id: `tx-${Date.now()}`,
            transaction_id: txnId,
            qr_code_id: qrCode.qr_code_id,
            wedding_id: qrCode.wedding_id,
            wedding_title: weddingTitle,
            amount: amount || qrCode.amount,
            payment_method,
            payment_provider: payment_method === 'EVC Plus' ? 'Hormuud EVC Plus' : payment_method === 'ZAAD' ? 'Telesom ZAAD' : payment_method === 'Sahal' ? 'Golis Sahal' : payment_method === 'Premier Bank' ? 'Premier Bank API' : 'Mastercard / Visa',
            provider_reference: `REF-${Math.floor(10000000 + Math.random() * 90000000)}`,
            status: 'SUCCESS',
            receipt_number: receiptNum,
            payer_name: payer_name || 'Honored Guest',
            payer_phone: payer_phone || '+252 61 000 0000',
            created_at: new Date().toISOString(),
            paid_at: new Date().toISOString(),
        };

        // Update state locally first (instant visual feed)
        set((state) => ({
            transactions: [newTxn, ...state.transactions],
            qrCodes: state.qrCodes.map((q) =>
                q.qr_code_id === qrCode.qr_code_id
                    ? { ...q, status: 'USED', used_at: newTxn.paid_at, transaction_id: txnId }
                    : q
            ),
        }));

        get().logAudit(
            'GATE_SCAN_PAYMENT',
            `Door Usher processed payment $${newTxn.amount} via ${payment_method} for QR ${qrCode.qr_code_id} (${payer_name})`
        );

        // Sync to Supabase in background
        try {
            await supabase.from('transactions').insert([{
                id: newTxn.id,
                transaction_id: newTxn.transaction_id,
                qr_code_id: newTxn.qr_code_id,
                wedding_id: newTxn.wedding_id,
                wedding_title: newTxn.wedding_title,
                amount: newTxn.amount,
                payment_method: newTxn.payment_method,
                payment_provider: newTxn.payment_provider,
                provider_reference: newTxn.provider_reference,
                status: newTxn.status,
                receipt_number: newTxn.receipt_number,
                payer_name: newTxn.payer_name,
                payer_phone: newTxn.payer_phone,
                created_at: newTxn.created_at,
                paid_at: newTxn.paid_at,
            }]);

            await supabase.from('qr_codes').update({
                status: 'USED',
                used_at: newTxn.paid_at,
                transaction_id: txnId,
            }).eq('qr_code_id', qrCode.qr_code_id);
        } catch (e) {
            console.log('Supabase sync note:', e);
        }

        return newTxn;
    },

    requestPayout: (weddingId, amount, method, account) => {
        const wedding = get().weddings.find((w) => w.id === weddingId);
        const fee = amount * 0.05; // 5% platform service fee
        const net_amount = amount - fee;

        const newPayout: PayoutRequest = {
            id: `po-${Date.now()}`,
            wedding_id: weddingId,
            wedding_title: wedding ? `${wedding.groom_name} & ${wedding.bride_name} Wedding` : 'Wedding Payout',
            amount,
            fee,
            net_amount,
            method,
            destination_account: account,
            status: 'PENDING',
            created_at: new Date().toISOString(),
        };

        set((state) => ({ payouts: [newPayout, ...state.payouts] }));
        get().logAudit('PAYOUT_REQUESTED', `Requested payout $${amount} to ${account} via ${method}`);
    },

    logAudit: (action, details) => {
        const user = get().currentUser;
        const newLog: AuditLog = {
            id: `log-${Date.now()}`,
            user_id: user ? user.id : 'usher-gate-public',
            user_name: user ? user.full_name : 'Public Usher Gate',
            role: user ? user.role : 'usher',
            action,
            details,
            timestamp: new Date().toISOString(),
        };

        set((state) => ({ auditLogs: [newLog, ...state.auditLogs] }));

        supabase.from('audit_logs').insert([{
            id: newLog.id,
            user_id: newLog.user_id,
            user_name: newLog.user_name,
            role: newLog.role,
            action: newLog.action,
            details: newLog.details,
            timestamp: newLog.timestamp,
        }]).then(() => { });
    },

    initRealtime: () => {
        if (get().isRealtimeConnected) return;

        try {
            const channel = supabase
                .channel('meher-pay-realtime')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transactions' }, (payload) => {
                    const newTxn = payload.new as Transaction;
                    set((state) => {
                        if (state.transactions.some((t) => t.id === newTxn.id || t.transaction_id === newTxn.transaction_id)) {
                            return state;
                        }
                        return { transactions: [newTxn, ...state.transactions] };
                    });
                })
                .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'qr_codes' }, (payload) => {
                    const updatedQr = payload.new as QrCode;
                    set((state) => ({
                        qrCodes: state.qrCodes.map((q) => (q.qr_code_id === updatedQr.qr_code_id ? { ...q, ...updatedQr } : q)),
                    }));
                })
                .subscribe((status) => {
                    if (status === 'SUBSCRIBED') {
                        set({ isRealtimeConnected: true });
                    }
                });
        } catch (e) {
            console.log('Realtime setup error handled gracefully:', e);
        }
    },
}));
