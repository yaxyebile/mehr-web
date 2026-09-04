import { User, Wedding, QrCode, Transaction, PaymentProvider, AuditLog, PayoutRequest } from './types';

export const INITIAL_USERS: User[] = [
    {
        id: 'usr-owner-1',
        full_name: 'Mahad Mohamed Ali',
        email: 'owner@meherpay.so',
        phone: '+252 61 555 0100',
        role: 'platform_owner',
        status: 'active',
        created_at: '2025-01-10T08:00:00Z'
    },
    {
        id: 'usr-admin-1',
        full_name: 'Amina Hassan Farah',
        email: 'amina.admin@meherpay.so',
        phone: '+252 61 555 0200',
        role: 'admin',
        status: 'active',
        created_at: '2025-02-01T10:30:00Z'
    },
    {
        id: 'usr-admin-2',
        full_name: 'Abdirahman Warsame',
        email: 'abdi.admin@meherpay.so',
        phone: '+252 63 444 0300',
        role: 'admin',
        status: 'active',
        created_at: '2025-02-15T14:20:00Z'
    },
    {
        id: 'usr-owner-wedding-1',
        full_name: 'Jama Ibrahim Duale',
        email: 'jama.event@gmail.com',
        phone: '+252 61 999 4433',
        role: 'wedding_owner',
        status: 'active',
        created_at: '2025-03-01T12:00:00Z'
    },
    {
        id: 'usr-owner-wedding-2',
        full_name: 'Fardowsa Sheikh Ahmed',
        email: 'fardowsa.weddings@outlook.com',
        phone: '+252 63 888 1122',
        role: 'wedding_owner',
        status: 'active',
        created_at: '2025-03-10T09:15:00Z'
    }
];

export const INITIAL_WEDDINGS: Wedding[] = [
    {
        id: 'wed-001',
        owner_id: 'usr-owner-wedding-1',
        bride_name: 'Sumaya Liban',
        groom_name: 'Farhan Mohamed',
        wedding_date: '2026-09-12',
        venue: 'Royal Palace Hotel, Mogadishu',
        guest_count: 450,
        sooryo_amount_per_person: 25,
        expected_amount: 11250,
        service_fee: 562.50,
        status: 'active',
        created_at: '2026-08-01T10:00:00Z'
    },
    {
        id: 'wed-002',
        owner_id: 'usr-owner-wedding-2',
        bride_name: 'Hodhan Said',
        groom_name: 'Khadar Osman',
        wedding_date: '2026-09-18',
        venue: 'Ambassador Hotel, Hargeisa',
        guest_count: 350,
        sooryo_amount_per_person: 30,
        expected_amount: 10500,
        service_fee: 525.00,
        status: 'active',
        created_at: '2026-08-10T14:30:00Z'
    },
    {
        id: 'wed-003',
        owner_id: 'usr-owner-wedding-1',
        bride_name: 'Muna Dahir',
        groom_name: 'Mustafe Gedi',
        wedding_date: '2026-08-20',
        venue: 'Jubba Palace, Garowe',
        guest_count: 300,
        sooryo_amount_per_person: 20,
        expected_amount: 6000,
        service_fee: 300.00,
        status: 'completed',
        created_at: '2026-07-15T09:00:00Z'
    }
];

export const INITIAL_PAYMENT_PROVIDERS: PaymentProvider[] = [
    {
        id: 'prov-1',
        name: 'Hormuud EVC Plus',
        code: 'evc_plus',
        status: 'active',
        is_configured: true,
        api_endpoint: 'https://api.hormuud.so/v2/evc/pay',
        merchant_id: 'MEHERPAY_EVC_MOG01',
        is_test_mode: false,
        supported_currencies: ['USD', 'SOS']
    },
    {
        id: 'prov-2',
        name: 'Telesom ZAAD',
        code: 'zaad',
        status: 'active',
        is_configured: true,
        api_endpoint: 'https://api.telesom.com/zaad/v1/merchant',
        merchant_id: 'MEHERPAY_ZAAD_HRG01',
        is_test_mode: false,
        supported_currencies: ['USD', 'SLSH']
    },
    {
        id: 'prov-3',
        name: 'Golis Sahal',
        code: 'sahal',
        status: 'active',
        is_configured: true,
        api_endpoint: 'https://api.golis.so/sahal/pay',
        merchant_id: 'MEHERPAY_SAHAL_GRW',
        is_test_mode: true,
        supported_currencies: ['USD']
    },
    {
        id: 'prov-4',
        name: 'Premier Bank API',
        code: 'premier_bank',
        status: 'active',
        is_configured: true,
        api_endpoint: 'https://gateway.premierbank.so/checkout',
        merchant_id: 'MER-889412-MHR',
        is_test_mode: true,
        supported_currencies: ['USD']
    },
    {
        id: 'prov-5',
        name: 'Mastercard / Visa',
        code: 'card_gateway',
        status: 'active',
        is_configured: true,
        api_endpoint: 'https://api.stripe.com/v1/charges',
        merchant_id: 'acct_1MeherPayIntl',
        is_test_mode: true,
        supported_currencies: ['USD', 'EUR']
    }
];

// Helper to generate seed QR codes
export function generateSeedQrCodes(): QrCode[] {
    const qrs: QrCode[] = [];

    // Wedding 1: 450 guests (Sumaya & Farhan)
    for (let i = 1; i <= 450; i++) {
        const padNum = String(i).padStart(3, '0');
        const isUsed = i <= 218; // 218 scanned/paid so far
        qrs.push({
            id: `qr-wed1-${padNum}`,
            qr_code_id: `MHR-WED1-GUEST-${padNum}`,
            wedding_id: 'wed-001',
            status: isUsed ? 'USED' : 'ACTIVE',
            amount: 25,
            created_at: '2026-08-01T10:00:00Z',
            used_at: isUsed ? `2026-09-04T${14 + Math.floor(i / 60)}:${(i * 3) % 60}:00Z` : null,
            transaction_id: isUsed ? `TXN-W1-${padNum}` : null
        });
    }

    // Wedding 2: 350 guests (Hodhan & Khadar)
    for (let i = 1; i <= 350; i++) {
        const padNum = String(i).padStart(3, '0');
        const isUsed = i <= 125;
        qrs.push({
            id: `qr-wed2-${padNum}`,
            qr_code_id: `MHR-WED2-GUEST-${padNum}`,
            wedding_id: 'wed-002',
            status: isUsed ? 'USED' : 'ACTIVE',
            amount: 30,
            created_at: '2026-08-10T14:30:00Z',
            used_at: isUsed ? `2026-09-04T${15 + Math.floor(i / 60)}:${(i * 4) % 60}:00Z` : null,
            transaction_id: isUsed ? `TXN-W2-${padNum}` : null
        });
    }

    return qrs;
}

export const INITIAL_TRANSACTIONS: Transaction[] = [
    {
        id: 'tx-001',
        transaction_id: 'TXN-W1-001',
        qr_code_id: 'MHR-WED1-GUEST-001',
        wedding_id: 'wed-001',
        wedding_title: 'Farhan & Sumaya Wedding',
        amount: 25,
        payment_method: 'EVC Plus',
        payment_provider: 'Hormuud EVC Plus',
        provider_reference: 'EVC-88491023',
        status: 'SUCCESS',
        receipt_number: 'REC-2026-901',
        payer_name: 'Hassan Ali Warsame',
        payer_phone: '+252 61 512 3456',
        created_at: '2026-09-04T16:10:00Z',
        paid_at: '2026-09-04T16:10:15Z'
    },
    {
        id: 'tx-002',
        transaction_id: 'TXN-W1-002',
        qr_code_id: 'MHR-WED1-GUEST-002',
        wedding_id: 'wed-001',
        wedding_title: 'Farhan & Sumaya Wedding',
        amount: 25,
        payment_method: 'EVC Plus',
        payment_provider: 'Hormuud EVC Plus',
        provider_reference: 'EVC-88491045',
        status: 'SUCCESS',
        receipt_number: 'REC-2026-902',
        payer_name: 'Khadra Yusuf Elmi',
        payer_phone: '+252 61 588 7766',
        created_at: '2026-09-04T16:15:00Z',
        paid_at: '2026-09-04T16:15:20Z'
    },
    {
        id: 'tx-003',
        transaction_id: 'TXN-W2-001',
        qr_code_id: 'MHR-WED2-GUEST-001',
        wedding_id: 'wed-002',
        wedding_title: 'Khadar & Hodhan Wedding',
        amount: 30,
        payment_method: 'ZAAD',
        payment_provider: 'Telesom ZAAD',
        provider_reference: 'ZAAD-9918231',
        status: 'SUCCESS',
        receipt_number: 'REC-2026-903',
        payer_name: 'Rashid Mohamed Duale',
        payer_phone: '+252 63 411 2233',
        created_at: '2026-09-04T16:22:00Z',
        paid_at: '2026-09-04T16:22:12Z'
    },
    {
        id: 'tx-004',
        transaction_id: 'TXN-W1-003',
        qr_code_id: 'MHR-WED1-GUEST-003',
        wedding_id: 'wed-001',
        wedding_title: 'Farhan & Sumaya Wedding',
        amount: 50, // Custom higher sooryo gift!
        payment_method: 'Premier Bank',
        payment_provider: 'Premier Bank API',
        provider_reference: 'PB-7762109',
        status: 'SUCCESS',
        receipt_number: 'REC-2026-904',
        payer_name: 'Dr. Mukhtar Sheikh Osman',
        payer_phone: '+252 61 700 9988',
        created_at: '2026-09-04T16:30:00Z',
        paid_at: '2026-09-04T16:30:30Z'
    },
    {
        id: 'tx-005',
        transaction_id: 'TXN-W2-002',
        qr_code_id: 'MHR-WED2-GUEST-002',
        wedding_id: 'wed-002',
        wedding_title: 'Khadar & Hodhan Wedding',
        amount: 30,
        payment_method: 'ZAAD',
        payment_provider: 'Telesom ZAAD',
        provider_reference: 'ZAAD-9918299',
        status: 'SUCCESS',
        receipt_number: 'REC-2026-905',
        payer_name: 'Hamda Ahmed Omar',
        payer_phone: '+252 63 499 8877',
        created_at: '2026-09-04T16:40:00Z',
        paid_at: '2026-09-04T16:40:05Z'
    }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
    {
        id: 'log-001',
        user_id: 'usr-owner-1',
        user_name: 'Mahad Mohamed Ali',
        role: 'platform_owner',
        action: 'PROVIDER_UPDATED',
        details: 'Updated Hormuud EVC Plus merchant account ID to MEHERPAY_EVC_MOG01',
        timestamp: '2026-09-04T14:30:00Z'
    },
    {
        id: 'log-002',
        user_id: 'usr-admin-1',
        user_name: 'Amina Hassan Farah',
        role: 'admin',
        action: 'WEDDING_VERIFIED',
        details: 'Verified Farhan & Sumaya Wedding parameters and approved guest QR set (450 QRs)',
        timestamp: '2026-09-04T15:10:00Z'
    },
    {
        id: 'log-003',
        user_id: 'usr-admin-2',
        user_name: 'Abdirahman Warsame',
        role: 'admin',
        action: 'ADMIN_CREATED',
        details: 'Created operational admin account for Hargeisa branch officer',
        timestamp: '2026-09-04T15:45:00Z'
    },
    {
        id: 'log-004',
        user_id: 'usher-gate-1',
        user_name: 'Door Usher Gate #1',
        role: 'usher',
        action: 'GATE_SCAN_PAYMENT',
        details: 'Scanned MHR-WED1-GUEST-001, verified EVC payment $25.00',
        timestamp: '2026-09-04T16:10:15Z'
    }
];

export const INITIAL_PAYOUTS: PayoutRequest[] = [
    {
        id: 'po-101',
        wedding_id: 'wed-003',
        wedding_title: 'Mustafe & Muna Wedding',
        amount: 6000,
        fee: 300,
        net_amount: 5700,
        method: 'EVC Plus',
        destination_account: '+252 61 999 4433',
        status: 'PROCESSED',
        created_at: '2026-08-21T10:00:00Z'
    },
    {
        id: 'po-102',
        wedding_id: 'wed-001',
        wedding_title: 'Farhan & Sumaya Wedding',
        amount: 5000,
        fee: 250,
        net_amount: 4750,
        method: 'EVC Plus',
        destination_account: '+252 61 999 4433',
        status: 'PENDING',
        created_at: '2026-09-04T15:00:00Z'
    }
];
