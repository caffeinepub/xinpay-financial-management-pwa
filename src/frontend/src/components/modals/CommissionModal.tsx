import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CommissionModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CommissionModal({
  open,
  onClose,
}: CommissionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1C2431] border-[#00E5FF]/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#00E5FF]">
            Commission Structure
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Card className="bg-[#0B1C14] border-[#00E5FF]/20 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white font-semibold">Gaming Fund</h3>
                <p className="text-sm text-gray-400">
                  Commission on gaming deposits
                </p>
              </div>
              <p className="text-2xl font-bold text-green-400">5%</p>
            </div>
          </Card>
          <Card className="bg-[#0B1C14] border-[#00E5FF]/20 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white font-semibold">Stock Fund</h3>
                <p className="text-sm text-gray-400">
                  Commission on stock investments
                </p>
              </div>
              <p className="text-2xl font-bold text-blue-400">10%</p>
            </div>
          </Card>
          <p className="text-xs text-gray-400 text-center">
            Commissions are calculated on referral deposits and credited to your
            account
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
