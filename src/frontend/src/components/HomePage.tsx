import { Card } from "@/components/ui/card";
import {
  Briefcase,
  Download,
  MessageCircle,
  Percent,
  Send,
  Upload,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import type { UserProfile } from "../types";
import BankDetailsForm from "./forms/BankDetailsForm";
import CommissionModal from "./modals/CommissionModal";
import INRDepositModal from "./modals/INRDepositModal";
import INRWithdrawModal from "./modals/INRWithdrawModal";
import SalaryModal from "./modals/SalaryModal";
import USDTDepositModal from "./modals/USDTDepositModal";
import USDTWithdrawModal from "./modals/USDTWithdrawModal";

interface HomePageProps {
  userProfile: UserProfile;
  onNavigate: (
    tab: "home" | "deposit" | "refer" | "support" | "profile",
  ) => void;
}

type ModalType =
  | "inr-deposit"
  | "inr-withdraw"
  | "usdt-deposit"
  | "usdt-withdraw"
  | "commission"
  | "salary"
  | null;

interface ActionItem {
  icon: React.ElementType;
  label: string;
  colorClass: string;
  modal?: ModalType;
  navigate?: "home" | "deposit" | "refer" | "support" | "profile";
}

export default function HomePage({ userProfile, onNavigate }: HomePageProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const inrBalance = Number(userProfile.inrBalance);
  const usdtBalance = Number(userProfile.usdtBalance);

  const actions: ActionItem[] = [
    {
      icon: Download,
      label: "INR Deposit",
      colorClass: "bg-blue-600",
      modal: "inr-deposit",
    },
    {
      icon: Upload,
      label: "INR Withdraw",
      colorClass: "bg-green-600",
      modal: "inr-withdraw",
    },
    {
      icon: Wallet,
      label: "USDT Deposit",
      colorClass: "bg-purple-600",
      modal: "usdt-deposit",
    },
    {
      icon: Send,
      label: "USDT Withdraw",
      colorClass: "bg-orange-600",
      modal: "usdt-withdraw",
    },
    {
      icon: Percent,
      label: "Commission",
      colorClass: "bg-pink-600",
      modal: "commission",
    },
    {
      icon: Users,
      label: "Refer",
      colorClass: "bg-cyan-600",
      navigate: "refer",
    },
    {
      icon: Briefcase,
      label: "Salary",
      colorClass: "bg-indigo-600",
      modal: "salary",
    },
    {
      icon: MessageCircle,
      label: "Contact",
      colorClass: "bg-teal-600",
      navigate: "support",
    },
  ];

  const handleActionClick = (action: ActionItem) => {
    if (action.navigate) {
      onNavigate(action.navigate);
    } else if (action.modal) {
      setActiveModal(action.modal);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-[#1C2431] border-[#00E5FF]/20 p-4">
            <p className="text-xs text-gray-400 mb-1">INR Balance</p>
            <p className="text-xl font-bold text-blue-400">
              ₹{inrBalance.toFixed(2)}
            </p>
          </Card>
          <Card className="bg-[#1C2431] border-[#00E5FF]/20 p-4">
            <p className="text-xs text-gray-400 mb-1">USDT Balance</p>
            <p className="text-xl font-bold text-green-400">
              ${usdtBalance.toFixed(2)}
            </p>
          </Card>
        </div>

        {/* Action Grid */}
        <div
          className="grid grid-cols-4 gap-3 relative z-10"
          data-ocid="home-action-grid"
        >
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              data-ocid={`action-btn-${action.label.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => handleActionClick(action)}
              className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-[#1C2431] border border-[#00E5FF]/20 hover:border-[#00E5FF]/60 active:scale-95 transition-all duration-150 cursor-pointer select-none"
            >
              <div
                className={`${action.colorClass} p-3 rounded-full pointer-events-none`}
              >
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs text-gray-300 text-center leading-tight pointer-events-none">
                {action.label}
              </span>
            </button>
          ))}
        </div>

        {/* Warning Card */}
        <Card className="bg-red-950/30 border-red-500/30 p-4">
          <h3 className="text-red-400 font-bold mb-2">⚠️ Anti-Theft Warning</h3>
          <p className="text-red-300 text-sm">
            Do not attempt to steal money from accounts — you will lose your
            security deposit.
          </p>
        </Card>

        {/* Info Cards */}
        <div className="space-y-3">
          <Card className="bg-[#1C2431] border-[#00E5FF]/20 p-4">
            <h3 className="text-[#00E5FF] font-semibold mb-2">
              Security Deposit
            </h3>
            <div className="space-y-1 text-sm text-gray-300">
              <p>• Savings Account: ₹3,000</p>
              <p>• Current Account: ₹6,000</p>
              <p>• Corporate Account: ₹12,000</p>
            </div>
          </Card>

          <Card className="bg-[#1C2431] border-[#00E5FF]/20 p-4">
            <h3 className="text-[#00E5FF] font-semibold mb-2">
              Stay Active Logic
            </h3>
            <p className="text-sm text-gray-300">
              Maintain regular activity to keep your account in good standing
              and unlock all features.
            </p>
          </Card>
        </div>

        {/* Bank Details Form */}
        <BankDetailsForm />
      </div>

      {/* Modals — rendered outside scroll container to avoid clipping */}
      <INRDepositModal
        open={activeModal === "inr-deposit"}
        onClose={() => setActiveModal(null)}
      />
      <INRWithdrawModal
        open={activeModal === "inr-withdraw"}
        onClose={() => setActiveModal(null)}
      />
      <USDTDepositModal
        open={activeModal === "usdt-deposit"}
        onClose={() => setActiveModal(null)}
      />
      <USDTWithdrawModal
        open={activeModal === "usdt-withdraw"}
        onClose={() => setActiveModal(null)}
      />
      <CommissionModal
        open={activeModal === "commission"}
        onClose={() => setActiveModal(null)}
      />
      <SalaryModal
        open={activeModal === "salary"}
        onClose={() => setActiveModal(null)}
      />
    </>
  );
}
