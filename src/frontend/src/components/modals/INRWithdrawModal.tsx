import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAddBankWithdrawal } from "../../hooks/useQueries";

interface INRWithdrawModalProps {
  open: boolean;
  onClose: () => void;
}

export default function INRWithdrawModal({
  open,
  onClose,
}: INRWithdrawModalProps) {
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const { mutate: addWithdrawal, isPending } = useAddBankWithdrawal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountInPaise = Math.round(Number.parseFloat(amount) * 100);

    addWithdrawal(
      {
        amount: BigInt(amountInPaise),
        accountNumber,
        ifsc,
      },
      {
        onSuccess: () => {
          setAmount("");
          setAccountNumber("");
          setIfsc("");
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1C2431] border-[#00E5FF]/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#00E5FF]">INR Withdrawal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="withdraw-amount" className="text-gray-300">
              Amount (₹)
            </Label>
            <Input
              id="withdraw-amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="bg-[#0B1C14] border-[#00E5FF]/30 text-white placeholder:text-gray-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="account-number" className="text-gray-300">
              Bank Account Number
            </Label>
            <Input
              id="account-number"
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter account number"
              className="bg-[#0B1C14] border-[#00E5FF]/30 text-white placeholder:text-gray-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ifsc" className="text-gray-300">
              IFSC Code
            </Label>
            <Input
              id="ifsc"
              type="text"
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value)}
              placeholder="Enter IFSC code"
              className="bg-[#0B1C14] border-[#00E5FF]/30 text-white placeholder:text-gray-500"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-[#0B1C14] font-semibold"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit Withdrawal"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
