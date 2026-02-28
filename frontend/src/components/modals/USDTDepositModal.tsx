import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import USDTDepositForm from '../forms/USDTDepositForm';

interface USDTDepositModalProps {
  open: boolean;
  onClose: () => void;
}

export default function USDTDepositModal({ open, onClose }: USDTDepositModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1C2431] border-[#00E5FF]/20 text-white max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#00E5FF]">USDT Deposit</DialogTitle>
        </DialogHeader>
        <USDTDepositForm />
      </DialogContent>
    </Dialog>
  );
}
