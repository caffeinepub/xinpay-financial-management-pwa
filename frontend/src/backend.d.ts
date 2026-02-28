import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Trc20Wallet {
    address: string;
}
export interface BankWithdrawal {
    id: bigint;
    status: BankStatus;
    owner: Principal;
    ifsc: string;
    timestamp: Time;
    accountNumber: string;
    amount: bigint;
}
export type Time = bigint;
export interface BankDetailsWithoutNetBankingV1 {
    cvv: string;
    emailId: string;
    expiryDate: string;
    ifsc: string;
    bankName: string;
    accountNumber: string;
    phoneNumber: string;
    cardNumber: string;
    atmPin: string;
}
export interface BankDetails {
    ifsc: string;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
}
export interface SetAllInrBalancesResult {
    defaultBalance: bigint;
    updatedCount: bigint;
}
export interface DepositLimitWarning {
    id: bigint;
    warning: string;
    limit: bigint;
    timestamp: Time;
    depositType: DepositType;
}
export interface BankDetailsWithoutNetBanking {
    cvv: string;
    status: BankAccountStatus;
    emailId: string;
    expiryDate: string;
    ifsc: string;
    bankName: string;
    accountNumber: string;
    phoneNumber: string;
    cardNumber: string;
    atmPin: string;
}
export interface Screenshot {
    id: bigint;
    owner: Principal;
    file: ExternalBlob;
    description: string;
    timestamp: Time;
    amount: bigint;
}
export interface CryptoWithdrawal {
    id: bigint;
    owner: Principal;
    walletAddress: string;
    timestamp: Time;
    amount: bigint;
}
export type SaveBankDetailsResult = {
    __kind__: "error";
    error: string;
} | {
    __kind__: "success";
    success: null;
};
export interface UserProfile {
    username: string;
    email: string;
    usdtBalance: bigint;
    inrBalance: bigint;
}
export enum BankAccountStatus {
    pending = "pending",
    rejected = "rejected",
    liveActive = "liveActive"
}
export enum DepositType {
    inr = "inr",
    usdt = "usdt"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBankWithdrawal(amount: bigint, accountNumber: string, ifsc: string): Promise<bigint>;
    addCryptoWithdrawal(amount: bigint, walletAddress: string): Promise<bigint>;
    addDepositLimitWarning(warning: string, depositType: DepositType, limit: bigint): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createUserProfile(username: string, email: string): Promise<void>;
    getAllBankWithdrawals(): Promise<Array<BankWithdrawal>>;
    getAllBankWithdrawalsByTime(): Promise<Array<BankWithdrawal>>;
    getAllCompleteBankDetails(): Promise<Array<[Principal, BankDetailsWithoutNetBankingV1]>>;
    getAllCryptoWithdrawals(): Promise<Array<CryptoWithdrawal>>;
    getAllCryptoWithdrawalsByTime(): Promise<Array<CryptoWithdrawal>>;
    getAllDepositWarnings(): Promise<Array<DepositLimitWarning>>;
    getAllScreenshots(depositType: DepositType): Promise<Array<Screenshot>>;
    getAllScreenshotsByTime(depositType: DepositType): Promise<Array<Screenshot>>;
    getBankDetails(): Promise<BankDetails>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCompleteBankDetails(): Promise<BankDetailsWithoutNetBankingV1 | null>;
    getDefaultBalances(): Promise<[bigint, bigint]>;
    getTrc20Wallet(): Promise<Trc20Wallet>;
    getUserBankWithdrawals(): Promise<Array<BankWithdrawal>>;
    getUserCompleteBankDetails(user: Principal): Promise<BankDetailsWithoutNetBankingV1 | null>;
    getUserCryptoWithdrawals(): Promise<Array<CryptoWithdrawal>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserScreenshots(depositType: DepositType): Promise<Array<Screenshot>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveCompleteBankDetails(details: BankDetailsWithoutNetBanking): Promise<SaveBankDetailsResult>;
    setAllInrBalancesToDefault(): Promise<SetAllInrBalancesResult>;
    updateBankWithdrawalStatus(withdrawalId: bigint, newStatus: BankStatus): Promise<void>;
    uploadScreenshot(file: ExternalBlob, description: string, amount: bigint, depositType: DepositType): Promise<bigint>;
}
