import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Headphones,
  Home,
  Landmark,
  Share2,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLocalAuth } from "../hooks/useLocalAuth";
import { useGetCallerUserProfile } from "../hooks/useQueries";
import type { UserProfile } from "../types";
import ActiveAccountsPage from "./ActiveAccountsPage";
import DepositPage from "./DepositPage";
import HomePage from "./HomePage";
import ProfilePage from "./ProfilePage";
import ReferPage from "./ReferPage";
import SupportPage from "./SupportPage";

interface MainAppProps {
  userProfile: UserProfile;
}

type ActiveTab =
  | "home"
  | "deposit"
  | "refer"
  | "support"
  | "profile"
  | "accounts";

export default function MainApp({
  userProfile: localUserProfile,
}: MainAppProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [showShareModal, setShowShareModal] = useState(false);
  const { updateProfile } = useLocalAuth();

  // Fetch backend profile - always fetch fresh data with zero cache
  const {
    data: backendProfile,
    isLoading: profileLoading,
    refetch,
  } = useGetCallerUserProfile();

  // Use backend profile if available, otherwise use local profile with zero balances
  const displayProfile: UserProfile = backendProfile || {
    username: localUserProfile.username,
    email: localUserProfile.email,
    inrBalance: BigInt(0),
    usdtBalance: BigInt(0),
  };

  // Sync backend profile to local storage when available
  useEffect(() => {
    if (backendProfile && !profileLoading) {
      updateProfile({
        inrBalance: backendProfile.inrBalance,
        usdtBalance: backendProfile.usdtBalance,
      });
    }
  }, [backendProfile, profileLoading, updateProfile]);

  // Refetch profile when switching to home or profile tabs
  useEffect(() => {
    if (activeTab === "home" || activeTab === "profile") {
      refetch();
    }
  }, [activeTab, refetch]);

  const handleNavigate = (tab: ActiveTab) => {
    setActiveTab(tab);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyAppLink = () => {
    const appLink = window.location.origin;
    navigator.clipboard.writeText(appLink);
    toast.success("App link copied to clipboard!");
  };

  const shareViaWhatsApp = () => {
    const appLink = window.location.origin;
    const message = `Check out XinPay - Professional Financial Management Platform: ${appLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const shareViaTelegram = () => {
    const appLink = window.location.origin;
    const message =
      "Check out XinPay - Professional Financial Management Platform";
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(appLink)}&text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  const navItems: { tab: ActiveTab; icon: React.ReactNode; label: string }[] = [
    { tab: "home", icon: <Home className="h-5 w-5" />, label: "Home" },
    { tab: "deposit", icon: <Wallet className="h-5 w-5" />, label: "Deposit" },
    {
      tab: "accounts",
      icon: <Landmark className="h-5 w-5" />,
      label: "Accounts",
    },
    { tab: "refer", icon: <Users className="h-5 w-5" />, label: "Refer" },
    {
      tab: "support",
      icon: <Headphones className="h-5 w-5" />,
      label: "Support",
    },
    { tab: "profile", icon: <User className="h-5 w-5" />, label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-[#0B1C14] pb-20">
      {/* Header */}
      <header className="bg-[#1C2431] border-b border-[#00E5FF]/20 sticky top-0 z-20">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/xinpay-logo.dim_200x200.png"
              alt="XinPay"
              className="h-10 w-10"
            />
            <div>
              <h1 className="text-[#00E5FF] font-bold text-lg">XinPay</h1>
              <p className="text-gray-400 text-xs">{displayProfile.username}</p>
            </div>
          </div>
          <Button
            onClick={handleShare}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-[#00E5FF] hover:bg-[#00E5FF]/10"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 relative z-10">
        {activeTab === "home" && (
          <HomePage userProfile={displayProfile} onNavigate={handleNavigate} />
        )}
        {activeTab === "deposit" && <DepositPage />}
        {activeTab === "accounts" && <ActiveAccountsPage />}
        {activeTab === "refer" && <ReferPage />}
        {activeTab === "support" && <SupportPage />}
        {activeTab === "profile" && (
          <ProfilePage userProfile={displayProfile} />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-[#1C2431] border-t border-[#00E5FF]/20">
        <div className="flex items-center justify-around px-1 py-2">
          {navItems.map(({ tab, icon, label }) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center gap-0.5 px-1 transition-colors ${
                activeTab === tab ? "text-[#00E5FF]" : "text-gray-400"
              }`}
            >
              {icon}
              <span className="text-[10px]">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Share Modal */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="bg-[#1C2431] border-[#00E5FF]/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-[#00E5FF]">Share XinPay</DialogTitle>
            <DialogDescription className="text-gray-400">
              Share the XinPay app with your friends and family
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-4">
            <Button
              onClick={copyAppLink}
              className="w-full bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-[#0B1C14] font-semibold"
            >
              Copy App Link
            </Button>
            <Button
              onClick={shareViaWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Share via WhatsApp
            </Button>
            <Button
              onClick={shareViaTelegram}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Share via Telegram
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
