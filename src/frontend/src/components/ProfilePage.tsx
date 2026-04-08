import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Principal } from "@dfinity/principal";
import {
  Building2,
  Clock,
  CreditCard,
  Loader2,
  LogOut,
  Mail,
  RefreshCw,
  Shield,
  User,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useLocalAuth } from "../hooks/useLocalAuth";
import {
  useGetAllCompleteBankDetails,
  useIsCallerAdmin,
  useSetAllInrBalancesToDefault,
} from "../hooks/useQueries";
import type { BankDetailsWithoutNetBankingV1, UserProfile } from "../types";

interface ProfilePageProps {
  userProfile: UserProfile;
}

function maskAccountNumber(accountNumber: string): string {
  if (!accountNumber || accountNumber.length <= 4) return accountNumber;
  return `••••${accountNumber.slice(-4)}`;
}

function AdminBankAccountCard({
  principal,
  details,
}: {
  principal: Principal;
  details: BankDetailsWithoutNetBankingV1;
}) {
  const principalStr = principal.toString();
  const shortPrincipal =
    principalStr.length > 16
      ? `${principalStr.slice(0, 8)}...${principalStr.slice(-6)}`
      : principalStr;

  return (
    <div className="p-4 bg-[#0B1C14] rounded-xl border border-[#00E5FF]/10 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-9 w-9 rounded-lg bg-[#00E5FF]/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="h-4 w-4 text-[#00E5FF]" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">
              {details.bankName}
            </p>
            <p className="text-gray-500 text-xs font-mono truncate">
              {shortPrincipal}
            </p>
          </div>
        </div>
        {/* Status badge — all submitted accounts are pending review */}
        <span className="flex items-center gap-1 text-yellow-400 text-xs font-semibold flex-shrink-0">
          <span className="h-2 w-2 rounded-full bg-yellow-500 inline-block" />
          Pending
        </span>
      </div>

      {/* Account Info */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 bg-[#1C2431] rounded-lg">
          <p className="text-gray-500">Account No.</p>
          <p className="text-white font-mono mt-0.5">
            {maskAccountNumber(details.accountNumber)}
          </p>
        </div>
        <div className="p-2 bg-[#1C2431] rounded-lg">
          <p className="text-gray-500">IFSC</p>
          <p className="text-white font-mono mt-0.5">{details.ifsc}</p>
        </div>
        {details.phoneNumber && (
          <div className="p-2 bg-[#1C2431] rounded-lg">
            <p className="text-gray-500">Phone</p>
            <p className="text-white font-mono mt-0.5">{details.phoneNumber}</p>
          </div>
        )}
        {details.emailId && (
          <div className="p-2 bg-[#1C2431] rounded-lg">
            <p className="text-gray-500">Email</p>
            <p className="text-white font-mono mt-0.5 truncate">
              {details.emailId}
            </p>
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="flex items-center gap-2 p-2 bg-[#1C2431] rounded-lg text-xs">
        <CreditCard className="h-3 w-3 text-[#00E5FF] flex-shrink-0" />
        <span className="text-gray-500">Card:</span>
        <span className="text-white font-mono">
          ••••{details.cardNumber.slice(-4)}
        </span>
        <span className="text-gray-500 ml-auto">{details.expiryDate}</span>
      </div>

      {/* Pending notice */}
      <div className="flex items-center gap-2 p-2 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
        <Clock className="h-3 w-3 text-yellow-400 flex-shrink-0" />
        <p className="text-yellow-400 text-xs">Awaiting manual verification</p>
      </div>
    </div>
  );
}

export default function ProfilePage({ userProfile }: ProfilePageProps) {
  const { logout } = useLocalAuth();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const setAllBalances = useSetAllInrBalancesToDefault();
  const { data: allBankDetails, isLoading: bankDetailsLoading } =
    useGetAllCompleteBankDetails();
  const [lastResult, setLastResult] = useState<{
    updatedCount: number;
    defaultBalance: number;
  } | null>(null);

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  const handleSetAllBalances = async () => {
    if (
      confirm(
        "Are you sure you want to set all users' INR balance to ₹1000.00? This action cannot be undone.",
      )
    ) {
      try {
        const result = await setAllBalances.mutateAsync();
        setLastResult({
          updatedCount: Number(result.updatedCount),
          defaultBalance: Number(result.defaultBalance),
        });
      } catch (error) {
        console.error("Failed to set balances:", error);
      }
    }
  };

  const inrBalance = Number(userProfile.inrBalance);
  const usdtBalance = Number(userProfile.usdtBalance);

  return (
    <div className="min-h-screen bg-[#0B1C14] space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-[#00E5FF]">Profile</h1>
        <p className="text-sm text-gray-400">Your account information</p>
      </header>

      <Card className="bg-[#1C2431] border-[#00E5FF]/20 p-6 space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-[#00E5FF]/20 flex items-center justify-center">
            <User className="h-10 w-10 text-[#00E5FF]" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">
              {userProfile.username}
            </h2>
            <p className="text-sm text-gray-400">{userProfile.email}</p>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#00E5FF]/20">
          <div className="flex items-center justify-between p-3 bg-[#0B1C14] rounded-lg">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-[#00E5FF]" />
              <div>
                <p className="text-xs text-gray-400">Username</p>
                <p className="text-sm font-medium text-white">
                  {userProfile.username}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#0B1C14] rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-[#00E5FF]" />
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm font-medium text-white">
                  {userProfile.email}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#0B1C14] rounded-lg">
            <div className="flex items-center space-x-3">
              <Wallet className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-xs text-gray-400">INR Balance</p>
                <p className="text-sm font-medium text-blue-400">
                  ₹{inrBalance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#0B1C14] rounded-lg">
            <div className="flex items-center space-x-3">
              <Wallet className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-xs text-gray-400">USDT Balance</p>
                <p className="text-sm font-medium text-green-400">
                  ${usdtBalance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Admin Controls */}
      {!isAdminLoading && isAdmin && (
        <>
          {/* Reset Balances */}
          <Card className="bg-[#1C2431] border-orange-500/30 p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-orange-400" />
              <h3 className="text-lg font-bold text-orange-400">
                Admin Controls
              </h3>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-400">
                Set all users' INR balance to the default amount (₹1000.00)
              </p>

              <Button
                onClick={handleSetAllBalances}
                disabled={setAllBalances.isPending}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold"
              >
                {setAllBalances.isPending ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Reset All INR Balances to ₹1000
                  </>
                )}
              </Button>

              {lastResult && (
                <div className="p-3 bg-[#0B1C14] rounded-lg border border-green-500/30">
                  <p className="text-sm text-green-400 font-medium">
                    ✓ Successfully updated {lastResult.updatedCount} user(s)
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Default balance: ₹{lastResult.defaultBalance.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Bank Account Management */}
          <Card className="bg-[#1C2431] border-orange-500/30 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-orange-400" />
                <h3 className="text-lg font-bold text-orange-400">
                  Bank Account Verification
                </h3>
              </div>
              {allBankDetails && (
                <span className="text-xs text-gray-400 bg-[#0B1C14] px-2 py-1 rounded-full">
                  {allBankDetails.length} account
                  {allBankDetails.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {bankDetailsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#00E5FF]" />
              </div>
            ) : !allBankDetails || allBankDetails.length === 0 ? (
              <div className="text-center py-6">
                <Building2 className="h-10 w-10 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">
                  No bank accounts submitted yet
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {allBankDetails.map(([principal, details]) => (
                  <AdminBankAccountCard
                    key={principal.toString()}
                    principal={principal}
                    details={details}
                  />
                ))}
              </div>
            )}
          </Card>
        </>
      )}

      <Button
        onClick={handleLogout}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
      >
        <LogOut className="h-5 w-5 mr-2" />
        Logout
      </Button>

      <footer className="text-center space-y-1 pt-4">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} XinPay | Trusted Payment Platform
        </p>
        <p className="text-xs text-gray-500">App Version 14.2.7 (Build 45)</p>
      </footer>
    </div>
  );
}
