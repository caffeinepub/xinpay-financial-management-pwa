import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import INRDepositForm from "./forms/INRDepositForm";
import USDTDepositForm from "./forms/USDTDepositForm";

export default function DepositPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-[#00E5FF]">Deposit Funds</h1>
        <p className="text-sm text-gray-400">Choose your deposit method</p>
      </header>

      <Tabs defaultValue="inr" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-[#1C2431]">
          <TabsTrigger
            value="inr"
            className="data-[state=active]:bg-[#00E5FF] data-[state=active]:text-[#0B1C14]"
          >
            INR Deposit
          </TabsTrigger>
          <TabsTrigger
            value="usdt"
            className="data-[state=active]:bg-[#00E5FF] data-[state=active]:text-[#0B1C14]"
          >
            USDT Deposit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inr" className="mt-4">
          <INRDepositForm />
        </TabsContent>

        <TabsContent value="usdt" className="mt-4">
          <USDTDepositForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
