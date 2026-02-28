import { BankDetailsWithoutNetBankingV1 } from '../backend';
import { useGetCompleteBankDetails } from '../hooks/useQueries';
import { Card } from '@/components/ui/card';
import { Loader2, Building2, CreditCard, Clock, Landmark } from 'lucide-react';

function StatusIndicator() {
  // Status field was removed from BankDetailsWithoutNetBankingV1 in the backend migration.
  // All submitted accounts are treated as "Pending / Verification" until admin approves.
  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#00E5FF]/10">
      <span className="relative flex h-3 w-3">
        <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
      </span>
      <span className="text-yellow-400 text-sm font-semibold flex items-center gap-1">
        <Clock className="h-4 w-4" />
        Pending / Verification
      </span>
    </div>
  );
}

function maskAccountNumber(accountNumber: string): string {
  if (!accountNumber || accountNumber.length <= 4) return accountNumber;
  const last4 = accountNumber.slice(-4);
  const masked = '•'.repeat(Math.min(accountNumber.length - 4, 8));
  return masked + ' ' + last4;
}

function AccountCard({ details }: { details: BankDetailsWithoutNetBankingV1 }) {
  return (
    <Card className="bg-[#1C2431] border-[#00E5FF]/20 p-5">
      {/* Bank Icon + Name */}
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
            <span className="text-gray-400 text-xs">IFSC Code</span>
          </div>
          <span className="text-white text-sm font-mono">
            {details.ifsc}
          </span>
        </div>

        {details.phoneNumber && (
          <div className="flex items-center justify-between p-3 bg-[#0B1C14] rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-[#00E5FF] text-xs">📱</span>
              <span className="text-gray-400 text-xs">Phone</span>
            </div>
            <span className="text-white text-sm font-mono">
              {details.phoneNumber}
            </span>
          </div>
        )}
      </div>

      {/* Status Indicator */}
      <StatusIndicator />
    </Card>
  );
}

export default function ActiveAccountsPage() {
  const { data: bankDetails, isLoading, isError, error } = useGetCompleteBankDetails();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1C14] space-y-4">
        <header>
          <h1 className="text-2xl font-bold text-[#00E5FF]">Active Accounts</h1>
          <p className="text-sm text-gray-400">Your linked bank accounts & verification status</p>
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
          <p className="text-sm text-gray-400">Your linked bank accounts & verification status</p>
        </header>
        <Card className="bg-[#1C2431] border-red-500/20 p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <span className="text-red-400 text-xl">⚠️</span>
            </div>
            <div>
              <h3 className="text-white font-semibold">Failed to Load Account</h3>
              <p className="text-gray-400 text-sm mt-1">
                {error instanceof Error ? error.message : 'Unable to fetch bank details. Please try again.'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1C14] space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-[#00E5FF]">Active Accounts</h1>
        <p className="text-sm text-gray-400">Your linked bank accounts & verification status</p>
      </header>

      {!bankDetails ? (
        /* Empty State */
        <Card className="bg-[#1C2431] border-[#00E5FF]/20 p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-[#00E5FF]/10 flex items-center justify-center">
              <Landmark className="h-8 w-8 text-[#00E5FF]/50" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">No Bank Account Linked</h3>
              <p className="text-gray-400 text-sm mt-1">
                You haven't submitted any bank account details yet.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Go to Home and use "Add Bank" to link your account.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        /* Account Card */
        <div className="space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
            Submitted Accounts
          </p>

          <AccountCard details={bankDetails} />

          {/* Info Note */}
          <div className="p-3 bg-[#1C2431]/50 rounded-lg border border-[#00E5FF]/10">
            <p className="text-xs text-gray-500 text-center">
              🔒 Account details are securely encrypted. Only last 4 digits are visible for security.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
