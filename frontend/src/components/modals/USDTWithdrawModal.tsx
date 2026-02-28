import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddCryptoWithdrawal } from '../../hooks/useQueries';

interface USDTWithdrawModalProps {
  open: boolean;
  onClose: () => void;
}

export default function USDTWithdrawModal({ open, onClose }: USDTWithdrawModalProps) {
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const { mutate: addWithdrawal, isPending } = useAddCryptoWithdrawal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountInCents = Math.round(parseFloat(amount) * 100);
    
    addWithdrawal(
      {
        amount: BigInt(amountInCents),
        walletAddress,
      },
      {
        onSuccess: () => {
          setAmount('');
          setWalletAddress('');
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1C2431] border-[#00E5FF]/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#00E5FF]">USDT Withdrawal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="usdt-withdraw-amount" className="text-gray-300">
              Amount (USDT)
            </Label>
            <Input
              id="usdt-withdraw-amount"
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
            <Label htmlFor="wallet-address" className="text-gray-300">
              TRC20 Wallet Address
            </Label>
            <Input
              id="wallet-address"
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter TRC20 wallet address"
              className="bg-[#0B1C14] border-[#00E5FF]/30 text-white placeholder:text-gray-500"
              required
            />
          </div>
          <p className="text-xs text-yellow-400">⚠️ Ensure the address is correct. Transactions cannot be reversed.</p>
          <Button
            type="submit"
            className="w-full bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-[#0B1C14] font-semibold"
            disabled={isPending}
          >
            {isPending ? 'Submitting...' : 'Submit Withdrawal'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
