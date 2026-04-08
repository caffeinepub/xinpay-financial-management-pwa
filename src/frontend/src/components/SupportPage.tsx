import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Radio } from "lucide-react";
import { SiTelegram } from "react-icons/si";

export default function SupportPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-[#00E5FF]">Contact Us</h1>
        <p className="text-sm text-gray-400">We're here to help you 24/7</p>
      </header>

      <Card className="bg-[#1C2431] border-[#00E5FF]/20 p-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-[#00E5FF]">XinPay</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            XinPay is a trusted fintech platform launched in November 2024. We
            connect Indian users to global payments, supporting secure deposits
            from Indian banks. Join us for fast, transparent, and reliable
            service.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-[#00E5FF] font-semibold mb-3 flex items-center">
              <SiTelegram className="h-5 w-5 mr-2" />
              VIP Agent Support
            </h3>
            <div className="space-y-2">
              <Button
                onClick={() => window.open("https://t.me/Xinpay3", "_blank")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start"
              >
                <SiTelegram className="h-5 w-5 mr-2" />
                @Xinpay3
              </Button>
              <Button
                onClick={() =>
                  window.open("https://t.me/agentxinpay2", "_blank")
                }
                className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start"
              >
                <SiTelegram className="h-5 w-5 mr-2" />
                @agentxinpay2
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-[#00E5FF] font-semibold mb-3 flex items-center">
              <Radio className="h-5 w-5 mr-2" />
              Official Channel
            </h3>
            <Button
              onClick={() => window.open("https://t.me/xinpay34", "_blank")}
              className="w-full bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-[#0B1C14] font-semibold"
            >
              t.me/xinpay34
            </Button>
            <p className="text-xs text-gray-400 mt-2 text-center">
              We're here to help you 24/7
            </p>
          </div>
        </div>
      </Card>

      <footer className="text-center space-y-1 pt-4">
        <p className="text-sm text-gray-400">
          © 2025 XinPay | Trusted Payment Platform
        </p>
        <p className="text-xs text-gray-500">App Version 14.2.7 (Build 45)</p>
      </footer>
    </div>
  );
}
