import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../backend";
import { useGetBankDetails, useUploadScreenshot } from "../../hooks/useQueries";
import { DepositType } from "../../hooks/useQueries";

export default function INRDepositForm() {
  const { data: bankDetails } = useGetBankDetails();
  const { mutate: uploadScreenshot, isPending } = useUploadScreenshot();
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !amount) {
      toast.error("Please provide amount and screenshot");
      return;
    }

    const amountInPaise = Math.round(Number.parseFloat(amount) * 100);
    if (!Number.isFinite(amountInPaise) || amountInPaise <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress(
      (percentage) => {
        setUploadProgress(percentage);
      },
    );

    uploadScreenshot(
      {
        file: blob,
        description: "INR Deposit",
        amount: BigInt(amountInPaise),
        depositType: DepositType.inr,
      },
      {
        onSuccess: () => {
          setAmount("");
          setFile(null);
          setUploadProgress(0);
        },
      },
    );
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Heading - Security Deposit */}
      <h2 className="text-2xl font-bold text-[#00E5FF] text-center pt-2">
        Security Deposit
      </h2>

      {/* Bank Details Card */}
      <Card className="bg-[#1C2431] border-[#00E5FF]/20 p-5 space-y-4">
        <h3 className="text-[#00E5FF] font-semibold text-lg mb-3">
          Bank Details
        </h3>
        {bankDetails && (
          <div className="space-y-3">
            {/* Bank Name */}
            <div className="p-3 bg-[#0B1C14] rounded-lg border border-[#00E5FF]/10">
              <p className="text-gray-400 text-xs mb-1">Bank Name</p>
              <p className="text-white font-medium text-base">
                {bankDetails.bankName}
              </p>
            </div>

            {/* Account Number with Copy */}
            <div className="p-3 bg-[#0B1C14] rounded-lg border border-[#00E5FF]/10 flex justify-between items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 text-xs mb-1">Account Number</p>
                <p className="text-white font-medium text-base break-all">
                  {bankDetails.accountNumber}
                </p>
              </div>
              <Button
                onClick={() =>
                  copyToClipboard(bankDetails.accountNumber, "Account Number")
                }
                size="icon"
                variant="ghost"
                className="text-[#00E5FF] hover:bg-[#00E5FF]/10 shrink-0"
                type="button"
                aria-label="Copy Account Number"
              >
                <Copy className="h-5 w-5" />
              </Button>
            </div>

            {/* IFSC with Copy */}
            <div className="p-3 bg-[#0B1C14] rounded-lg border border-[#00E5FF]/10 flex justify-between items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 text-xs mb-1">IFSC Code</p>
                <p className="text-white font-medium text-base">
                  {bankDetails.ifsc}
                </p>
              </div>
              <Button
                onClick={() => copyToClipboard(bankDetails.ifsc, "IFSC Code")}
                size="icon"
                variant="ghost"
                className="text-[#00E5FF] hover:bg-[#00E5FF]/10 shrink-0"
                type="button"
                aria-label="Copy IFSC Code"
              >
                <Copy className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* UPI QR Code Card */}
      <Card className="bg-[#1C2431] border-[#00E5FF]/20 p-5 space-y-4">
        <h3 className="text-[#00E5FF] font-semibold text-lg text-center">
          UPI QR Code
        </h3>
        <div className="flex justify-center">
          <div className="bg-white p-3 rounded-lg">
            <img
              src="/assets/whatsapp_image_2026-04-09_at_3.26.02_pm-019d7200-9032-771c-a1b6-ed99cf8e28ff.jpeg"
              alt="UPI QR Code"
              className="w-[150px] h-[150px] object-contain"
            />
          </div>
        </div>
        <p className="text-gray-400 text-xs text-center">
          Scan QR code to make payment
        </p>
      </Card>

      {/* Deposit Form Card */}
      <Card className="bg-[#1C2431] border-[#00E5FF]/20 p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-300">
              Amount (₹)
            </Label>
            <Input
              id="amount"
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
            <Label htmlFor="screenshot" className="text-gray-300">
              Upload Payment Screenshot
            </Label>
            <div className="relative">
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="bg-[#0B1C14] border-[#00E5FF]/30 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#00E5FF] file:text-[#0B1C14] hover:file:bg-[#00E5FF]/90"
                required
              />
            </div>
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
            {isPending ? "Submitting Deposit..." : "Submit Deposit"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
