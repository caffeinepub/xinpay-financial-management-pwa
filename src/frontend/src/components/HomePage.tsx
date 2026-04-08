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

export default function HomePage({ userProfile, onNavigate }: HomePageProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Convert bigint balances to display format with two decimal places
  const inrBalance = Number(userProfile.inrBalance);
  const usdtBalance = Number(userProfile.usdtBalance);

  const actions = [
    {
      icon: Download,
      label: "INR Deposit",
      color: "bg-blue-600",
      modal: "inr-deposit" as ModalType,
    },
    {
      icon: Upload,
      label: "INR Withdraw",
      color: "bg-green-600",
      modal: "inr-withdraw" as ModalType,
    },
    {
      icon: Wallet,
      label: "USDT Deposit",
      color: "bg-purple-600",
      modal: "usdt-deposit" as ModalType,
    },
    {
      icon: Send,
      label: "USDT Withdraw",
      color: "bg-orange-600",
      modal: "usdt-withdraw" as ModalType,
    },
    {
      icon: Percent,
      label: "Commission",
      color: "bg-pink-600",
      modal: "commission" as ModalType,
    },
    {
      icon: Users,
      label: "Refer",
      color: "bg-cyan-600",
      onClick: () => onNavigate("refer"),
    },
    {
      icon: Briefcase,
      label: "Salary",
      color: "bg-indigo-600",
      modal: "salary" as ModalType,
    },
    {
      icon: MessageCircle,
      label: "Contact",
      color: "bg-teal-600",
      onClick: () => onNavigate("support"),
    },
  ];

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
        <div className="grid grid-cols-4 gap-3">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => {
                if (action.onClick) {
                  action.onClick();
                } else if (action.modal) {
                  setActiveModal(action.modal);
                }
              }}
              className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-[#1C2431] border border-[#00E5FF]/20 hover:border-[#00E5FF]/50 transition-colors"
            >
              <div className={`${action.color} p-3 rounded-full`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs text-gray-300 text-center leading-tight">
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

      {/* Modals */}
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
