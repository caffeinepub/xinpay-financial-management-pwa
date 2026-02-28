import { useState } from 'react';
import { useGetTrc20Wallet, useUploadScreenshot } from '../../hooks/useQueries';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { DepositType, ExternalBlob } from '../../backend';

export default function USDTDepositForm() {
  const { data: walletData } = useGetTrc20Wallet();
  const { mutate: uploadScreenshot, isPending } = useUploadScreenshot();
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Wallet address copied!');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !amount) {
      toast.error('Please provide amount and screenshot');
      return;
    }

    const amountInCents = Math.round(parseFloat(amount) * 100);
    if (isNaN(amountInCents) || amountInCents <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
      setUploadProgress(percentage);
    });

    uploadScreenshot(
      {
        file: blob,
        description: 'USDT Deposit',
        amount: BigInt(amountInCents),
        depositType: DepositType.usdt,
      },
      {
        onSuccess: () => {
          setAmount('');
          setFile(null);
          setUploadProgress(0);
        },
      }
    );
  };

  return (
    <Card className="bg-[#1C2431] border-[#00E5FF]/20 p-4 space-y-4">
      <div className="space-y-3">
        <h3 className="text-[#00E5FF] font-semibold">TRC-20 Wallet Address</h3>
        {walletData && (
          <div className="flex justify-between items-center p-3 bg-[#0B1C14] rounded">
            <div className="flex-1 mr-2">
              <p className="text-gray-400 text-xs mb-1">Address</p>
              <p className="text-white text-sm break-all">{walletData.address}</p>
            </div>
            <Button
              onClick={() => copyToClipboard(walletData.address)}
              size="icon"
              variant="ghost"
              className="text-[#00E5FF] hover:bg-[#00E5FF]/10 flex-shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
        <p className="text-xs text-yellow-400">⚠️ Only send USDT via TRC-20 network</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="usdt-amount" className="text-gray-300">
            Amount (USDT)
          </Label>
          <Input
            id="usdt-amount"
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
          <Label htmlFor="usdt-screenshot" className="text-gray-300">
            Upload Transaction Screenshot
          </Label>
          <Input
            id="usdt-screenshot"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="bg-[#0B1C14] border-[#00E5FF]/30 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#00E5FF] file:text-[#0B1C14] hover:file:bg-[#00E5FF]/90"
            required
          />
          {file && <p className="text-xs text-gray-400">{file.name}</p>}
        </div>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-[#0B1C14] rounded-full h-2">
              <div
                className="bg-[#00E5FF] h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-[#0B1C14] font-semibold"
          disabled={isPending || !file || !amount}
        >
          {isPending ? 'Submitting...' : 'Submit Deposit'}
        </Button>
      </form>
    </Card>
  );
}
