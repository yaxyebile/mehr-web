export type UserRole = 'platform_owner' | 'admin' | 'wedding_owner' | 'usher';
export type UserStatus = 'active' | 'suspended' | 'pending';

export interface User {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
    created_at: string;
}

export type WeddingStatus = 'active' | 'completed' | 'suspended' | 'draft';

export interface Wedding {
    id: string;
    owner_id: string;
    bride_name: string;
    groom_name: string;
    wedding_date: string;
    venue: string;
    guest_count: number;
    sooryo_amount_per_person: number;
    expected_amount: number;
    service_fee: number;
    status: WeddingStatus;
    created_at: string;
    owner?: User;
}

export type QrCodeStatus = 'ACTIVE' | 'USED' | 'EXPIRED' | 'REVOKED';

export interface QrCode {
    id: string;
    qr_code_id: string;
    wedding_id: string;
    status: QrCodeStatus;
    amount: number;
    created_at: string;
    used_at?: string | null;
    transaction_id?: string | null;
    wedding?: Wedding;
}

export type PaymentMethod = 'EVC Plus' | 'ZAAD' | 'Sahal' | 'Premier Bank' | 'Mastercard/Visa';
export type TransactionStatus = 'SUCCESS' | 'PENDING' | 'FAILED';

export interface Transaction {
    id: string;
    transaction_id: string;
    qr_code_id: string;
    wedding_id: string;
    wedding_title: string;
    amount: number;
    payment_method: PaymentMethod;
    payment_provider: string;
    provider_reference: string;
    status: TransactionStatus;
    receipt_number: string;
    payer_name: string;
    payer_phone: string;
    created_at: string;
    paid_at?: string | null;
}

export interface PaymentProvider {
    id: string;
    name: string;
    code: string;
    status: 'active' | 'inactive';
    is_configured: boolean;
    api_endpoint: string;
    merchant_id: string;
    is_test_mode: boolean;
    supported_currencies: string[];
}

export interface AuditLog {
    id: string;
    user_id: string;
    user_name: string;
    role: string;
    action: string;
    details: string;
    timestamp: string;
}

export interface PayoutRequest {
    id: string;
    wedding_id: string;
    wedding_title: string;
    amount: number;
    fee: number;
    net_amount: number;
    method: PaymentMethod;
    destination_account: string;
    status: 'PENDING' | 'APPROVED' | 'PROCESSED' | 'REJECTED';
    created_at: string;
}
