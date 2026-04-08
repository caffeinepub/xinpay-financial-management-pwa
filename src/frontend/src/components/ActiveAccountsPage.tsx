import { Card } from "@/components/ui/card";
import {
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  Landmark,
  Loader2,
  XCircle,
} from "lucide-react";
import { useGetAllBankAccounts } from "../hooks/useQueries";
import type { BankDetailsWithoutNetBanking } from "../types";
import { BankAccountStatus } from "../types";

function maskAccountNumber(accountNumber: string): string {
  if (!accountNumber || accountNumber.length <= 4) return accountNumber;
  const last4 = accountNumber.slice(-4);
  const masked = "•".repeat(Math.min(accountNumber.length - 4, 8));
  return `${masked} ${last4}`;
}

function StatusIndicator({ status }: { status: BankAccountStatus }) {
  if (status === BankAccountStatus.liveActive) {
    return (
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#00E5FF]/10">
        <span className="relative flex h-3 w-3">
          <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
        </span>
        <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
          <CheckCircle2 className="h-4 w-4" />
          Live Active
        </span>
      </div>
    );
  }

  if (status === BankAccountStatus.rejected) {
    return (
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#00E5FF]/10">
        <span className="relative flex h-3 w-3">
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
        </span>
        <span className="text-red-400 text-sm font-semibold flex items-center gap-1">
          <XCircle className="h-4 w-4" />
          Error / Rejected
        </span>
      </div>
    );
  }

  // Default: pending
  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#00E5FF]/10">
      <span className="relative flex h-3 w-3">
        <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500" />
      </span>
      <span className="text-yellow-400 text-sm font-semibold flex items-center gap-1">
        <Clock className="h-4 w-4" />
        Pending / Verification
      </span>
    </div>
  );
}

function AccountCard({
  details,
  index,
}: { details: BankDetailsWithoutNetBanking; index: number }) {
  return (
    <Card className="bg-[#1C2431] border-[#00E5FF]/20 p-5">
      {/* Bank Icon + Name + Account Type */}
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-[#00E5FF]/10 flex items-center justify-center flex-shrink-0">
          <Building2 className="h-6 w-6 text-[#00E5FF]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-base truncate">
            {details.bankName}
          </h3>
          <p className="text-gray-400 text-xs mt-0.5">Saving Account</p>
        </div>
        <span className="text-gray-500 text-xs bg-[#0B1C14] px-2 py-1 rounded-full">
          #{index + 1}
        </span>
      </div>

      {/* Account Details */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between p-3 bg-[#0B1C14] rounded-lg">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-[#00E5FF]" />
            <span className="text-gray-400 text-xs">Account Number</span>
          </div>
          <span className="text-white text-sm font-mono font-semibold tracking-wider">
            {maskAccountNumber(details.accountNumber)}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-[#0B1C14] rounded-lg">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#00E5FF]" />
            <span className="text-gray-400 text-xs">Bank Name</span>
          </div>
          <span className="text-white text-sm font-mono truncate max-w-[140px]">
            {details.bankName}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-[#0B1C14] rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-[#00E5FF] text-xs font-bold">IFSC</span>
          </div>
          <span className="text-white text-sm font-mono">{details.ifsc}</span>
        </div>
      </div>

      {/* Status Indicator */}
      <StatusIndicator status={details.status as BankAccountStatus} />
    </Card>
  );
}

export default function ActiveAccountsPage() {
  const { data: accounts, isLoading, isError } = useGetAllBankAccounts();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1C14] space-y-4">
        <header>
          <h1 className="text-2xl font-bold text-[#00E5FF]">Active Accounts</h1>
          <p className="text-sm text-gray-400">
            Your linked bank accounts & verification status
          </p>
        </header>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[#00E5FF]" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#0B1C14] space-y-4">
        <header>
          <h1 className="text-2xl font-bold text-[#00E5FF]">Active Accounts</h1>
          <p className="text-sm text-gray-400">
            Your linked bank accounts & verification status
          </p>
        </header>
        <Card className="bg-[#1C2431] border-[#00E5FF]/20 p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-[#00E5FF]/10 flex items-center justify-center">
              <Landmark className="h-8 w-8 text-[#00E5FF]/50" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                No Bank Account Linked
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                You haven't submitted any bank account details yet.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Go to Home and use "Add Bank" to link your account.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const accountList = accounts ?? [];

  return (
    <div className="min-h-screen bg-[#0B1C14] space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-[#00E5FF]">Active Accounts</h1>
        <p className="text-sm text-gray-400">
          Your linked bank accounts & verification status
        </p>
      </header>

      {accountList.length === 0 ? (
        /* Empty State */
        <Card className="bg-[#1C2431] border-[#00E5FF]/20 p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-[#00E5FF]/10 flex items-center justify-center">
              <Landmark className="h-8 w-8 text-[#00E5FF]/50" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                No Bank Account Linked
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                No bank accounts have been submitted yet.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Go to Home and use "Add Bank" to link your account.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        /* Account Cards */
        <div className="space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
            Submitted Accounts ({accountList.length})
          </p>

          {accountList.map((account, index) => (
            <AccountCard
              key={`${account.accountNumber}-${index}`}
              details={account}
              index={index}
            />
          ))}

          {/* Info Note */}
          <div className="p-3 bg-[#1C2431]/50 rounded-lg border border-[#00E5FF]/10">
            <p className="text-xs text-gray-500 text-center">
              🔒 Account details are securely encrypted. Only last 4 digits are
              visible for security.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
