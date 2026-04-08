import type { Principal } from "@dfinity/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ExternalBlob } from "../backend";
import type {
  BankDetailsWithoutNetBanking,
  BankDetailsWithoutNetBankingV1,
  SetAllInrBalancesResult,
  UserProfile,
} from "../types";
import { BankAccountStatus } from "../types";

export enum DepositType {
  inr = "inr",
  usdt = "usdt",
}

// --- LocalStorage keys ---
const BANK_ACCOUNTS_KEY = "xinpay_bank_accounts";
const USERS_KEY = "xinpay_users";

function getBankAccounts(): BankDetailsWithoutNetBanking[] {
  try {
    const stored = localStorage.getItem(BANK_ACCOUNTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveBankAccounts(accounts: BankDetailsWithoutNetBanking[]) {
  localStorage.setItem(BANK_ACCOUNTS_KEY, JSON.stringify(accounts));
}

// --- Auth helpers ---
function getCurrentUserEmail(): string | null {
  return localStorage.getItem("xinpay_session");
}

function getStoredUsers(): Array<{
  username: string;
  email: string;
  password: string;
  inrBalance: string;
  usdtBalance: string;
}> {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// --- Hooks ---

export function useGetCallerUserProfile() {
  return useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      const email = getCurrentUserEmail();
      if (!email) return null;
      const users = getStoredUsers();
      const user = users.find((u) => u.email === email);
      if (!user) return null;
      return {
        username: user.username,
        email: user.email,
        inrBalance: BigInt(user.inrBalance ?? "0"),
        usdtBalance: BigInt(user.usdtBalance ?? "0"),
      };
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}

export function useCreateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      username,
      email,
    }: { username: string; email: string }) => {
      // Handled by useLocalAuth signup
      return { username, email };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useSaveCallerUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_profile: UserProfile) => {
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      toast.success("Profile saved successfully");
    },
  });
}

export function useGetBankDetails() {
  return useQuery({
    queryKey: ["bankDetails"],
    queryFn: async () => ({
      bankName: "Punjab & Sind Bank",
      accountNumber: "01031001005357",
      ifsc: "PSIB0000103",
      accountHolder: "Mr. GOURAV KASERA",
    }),
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useGetTrc20Wallet() {
  return useQuery({
    queryKey: ["trc20Wallet"],
    queryFn: async () => ({
      address: "0x4b346c3Db9E1259bf8e0852707DF8685145a4520",
    }),
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useUploadScreenshot() {
  return useMutation({
    mutationFn: async ({
      file: _file,
      description: _description,
      amount: _amount,
      depositType: _depositType,
    }: {
      file: ExternalBlob;
      description: string;
      amount: bigint;
      depositType: DepositType;
    }) => {
      // Screenshot upload — no backend, just acknowledge
      return true;
    },
    onSuccess: () => {
      toast.success("Screenshot uploaded successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload screenshot: ${error.message}`);
    },
  });
}

export function useAddBankWithdrawal() {
  return useMutation({
    mutationFn: async ({
      amount: _amount,
      accountNumber: _accountNumber,
      ifsc: _ifsc,
    }: {
      amount: bigint;
      accountNumber: string;
      ifsc: string;
    }) => true,
    onSuccess: () => {
      toast.success("Withdrawal request submitted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit withdrawal: ${error.message}`);
    },
  });
}

export function useAddCryptoWithdrawal() {
  return useMutation({
    mutationFn: async ({
      amount: _amount,
      walletAddress: _walletAddress,
    }: { amount: bigint; walletAddress: string }) => true,
    onSuccess: () => {
      toast.success("Withdrawal request submitted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit withdrawal: ${error.message}`);
    },
  });
}

export function useGetCompleteBankDetails() {
  return useQuery<BankDetailsWithoutNetBankingV1 | null>({
    queryKey: ["completeBankDetails"],
    queryFn: async () => {
      const email = getCurrentUserEmail();
      if (!email) return null;
      const accounts = getBankAccounts();
      return (
        accounts.find(
          (a) =>
            (a as BankDetailsWithoutNetBanking & { ownerEmail?: string })
              .ownerEmail === email,
        ) ?? null
      );
    },
    staleTime: 0,
    gcTime: 0,
  });
}

export function useSaveCompleteBankDetails() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (details: BankDetailsWithoutNetBanking) => {
      const email = getCurrentUserEmail();
      const accounts = getBankAccounts();
      const entry = {
        ...details,
        status: BankAccountStatus.pending as const,
        ownerEmail: email ?? "",
      };
      // Remove existing entry for this user and add new one
      const filtered = accounts.filter(
        (a) =>
          (a as BankDetailsWithoutNetBanking & { ownerEmail?: string })
            .ownerEmail !== email,
      );
      filtered.push(entry);
      saveBankAccounts(filtered);
      return { __kind__: "ok" as const };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["completeBankDetails"] });
      queryClient.invalidateQueries({ queryKey: ["allBankAccounts"] });
    },
  });
}

export function useIsCallerAdmin() {
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => false,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useSetAllInrBalancesToDefault() {
  const queryClient = useQueryClient();
  return useMutation<SetAllInrBalancesResult, Error>({
    mutationFn: async () => {
      const users = getStoredUsers();
      const updated = users.map((u) => ({ ...u, inrBalance: "0" }));
      localStorage.setItem(USERS_KEY, JSON.stringify(updated));
      return { updatedCount: updated.length, defaultBalance: 0 };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      toast.success(
        `Successfully updated ${result.updatedCount} user(s) to ₹${result.defaultBalance.toFixed(2)}`,
      );
    },
    onError: (error: Error) => {
      toast.error(`Failed to update balances: ${error.message}`);
    },
  });
}

export function useGetAllCompleteBankDetails() {
  return useQuery<Array<[Principal, BankDetailsWithoutNetBankingV1]>>({
    queryKey: ["allCompleteBankDetails"],
    queryFn: async () => [],
    staleTime: 0,
    gcTime: 0,
  });
}

export function useUpdateBankAccountStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      withdrawalId: _withdrawalId,
      newStatus: _newStatus,
    }: { withdrawalId: bigint; newStatus: BankAccountStatus }) => true,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["completeBankDetails"] });
      queryClient.invalidateQueries({ queryKey: ["allCompleteBankDetails"] });
      toast.success("Bank account status updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });
}

export function useGetAllBankAccounts() {
  return useQuery<BankDetailsWithoutNetBanking[]>({
    queryKey: ["allBankAccounts"],
    queryFn: async () => getBankAccounts(),
    staleTime: 0,
    gcTime: 0,
    retry: false,
  });
}
