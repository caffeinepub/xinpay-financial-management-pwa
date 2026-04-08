import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import INRDepositForm from "../forms/INRDepositForm";

interface INRDepositModalProps {
  open: boolean;
  onClose: () => void;
}

export default function INRDepositModal({
  open,
  onClose,
}: INRDepositModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1C2431] border-[#00E5FF]/20 text-white max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#00E5FF]">INR Deposit</DialogTitle>
        </DialogHeader>
        <INRDepositForm />
      </DialogContent>
    </Dialog>
  );
}
