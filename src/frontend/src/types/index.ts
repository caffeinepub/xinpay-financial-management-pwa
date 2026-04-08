// Local types — backend is minimal, so all domain types live here

export interface UserProfile {
  username: string;
  email: string;
  inrBalance: bigint;
  usdtBalance: bigint;
}

export interface BankDetailsWithoutNetBanking {
  bankName: string;
  accountNumber: string;
  ifsc: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  atmPin: string;
  phoneNumber: string;
  emailId: string;
  status: BankAccountStatusValue;
}

export type BankDetailsWithoutNetBankingV1 = BankDetailsWithoutNetBanking;

export type BankAccountStatusValue = "pending" | "liveActive" | "rejected";

export enum BankAccountStatus {
  pending = "pending",
  liveActive = "liveActive",
  rejected = "rejected",
}

export enum DepositType {
  inr = "inr",
  usdt = "usdt",
}

export interface SetAllInrBalancesResult {
  updatedCount: number;
  defaultBalance: number;
}
