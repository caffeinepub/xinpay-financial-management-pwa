import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { SiWhatsapp, SiTelegram } from 'react-icons/si';
import { toast } from 'sonner';

export default function ReferPage() {
  const referralCode = 'XIN897';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied!');
  };

  const shareWhatsApp = () => {
    const message = `Join XinPay using my referral code: ${referralCode}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareTelegram = () => {
    const message = `Join XinPay using my referral code: ${referralCode}`;
    window.open(`https://t.me/share/url?url=&text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-[#00E5FF]">Refer and Earn</h1>
        <p className="text-sm text-gray-400">Share your referral code with friends</p>
      </header>

      <Card className="bg-[#1C2431] border-[#00E5FF]/20 p-6 space-y-4">
        <div className="text-center space-y-2">
          <p className="text-gray-400 text-sm">Your Referral Code</p>
          <div className="flex items-center justify-center space-x-2">
            <p className="text-3xl font-bold text-[#00E5FF] tracking-wider">{referralCode}</p>
            <Button
              onClick={copyToClipboard}
              size="icon"
              variant="ghost"
              className="text-[#00E5FF] hover:bg-[#00E5FF]/10"
            >
              <Copy className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-400 text-center">Share via</p>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={shareWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <SiWhatsapp className="h-5 w-5 mr-2" />
              WhatsApp
            </Button>
            <Button
              onClick={shareTelegram}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <SiTelegram className="h-5 w-5 mr-2" />
              Telegram
            </Button>
          </div>
        </div>
      </Card>

      <Card className="bg-[#1C2431] border-[#00E5FF]/20 p-4">
        <h3 className="text-[#00E5FF] font-semibold mb-2">How It Works</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>• Share your referral code with friends</li>
          <li>• They sign up using your code</li>
          <li>• You earn commission on their deposits</li>
          <li>• Track your earnings in the Commission section</li>
        </ul>
      </Card>
    </div>
  );
}
