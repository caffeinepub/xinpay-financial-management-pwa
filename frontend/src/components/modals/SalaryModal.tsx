import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SalaryModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SalaryModal({ open, onClose }: SalaryModalProps) {
  const salaryStructure = [
    { deposit: '₹5,000', salary: '₹3,500' },
    { deposit: '₹10,000', salary: '₹7,000' },
    { deposit: '₹20,000', salary: '₹14,000' },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1C2431] border-[#00E5FF]/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#00E5FF]">Salary Structure</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow className="border-[#00E5FF]/20 hover:bg-transparent">
                <TableHead className="text-[#00E5FF]">Deposit Amount</TableHead>
                <TableHead className="text-[#00E5FF] text-right">Monthly Salary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salaryStructure.map((item, index) => (
                <TableRow key={index} className="border-[#00E5FF]/20 hover:bg-[#0B1C14]/50">
                  <TableCell className="text-white font-medium">{item.deposit}</TableCell>
                  <TableCell className="text-green-400 font-semibold text-right">{item.salary}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-xs text-gray-400 text-center">
            Salary is paid monthly based on your active deposit amount
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
