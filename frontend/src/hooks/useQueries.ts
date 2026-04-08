import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile, DepositType, ExternalBlob, BankDetailsWithoutNetBanking, BankDetailsWithoutNetBankingV1, SetAllInrBalancesResult, BankAccountStatus } from '../backend';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const profile = await actor.getCallerUserProfile();
      return profile;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useCreateUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username, email }: { username: string; email: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createUserProfile(username, email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
    onError: (error: Error) => {
      console.error('Failed to create profile:', error.message);
    },
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save profile: ${error.message}`);
    },
  });
}

export function useGetBankDetails() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['bankDetails'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBankDetails();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTrc20Wallet() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['trc20Wallet'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTrc20Wallet();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadScreenshot() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      description,
      amount,
      depositType,
    }: {
      file: ExternalBlob;
      description: string;
      amount: bigint;
      depositType: DepositType;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadScreenshot(file, description, amount, depositType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userScreenshots'] });
      toast.success('Screenshot uploaded successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload screenshot: ${error.message}`);
    },
  });
}

export function useAddBankWithdrawal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      amount,
      accountNumber,
      ifsc,
    }: {
      amount: bigint;
      accountNumber: string;
      ifsc: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addBankWithdrawal(amount, accountNumber, ifsc);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankWithdrawals'] });
      toast.success('Withdrawal request submitted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit withdrawal: ${error.message}`);
    },
  });
}

export function useAddCryptoWithdrawal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, walletAddress }: { amount: bigint; walletAddress: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCryptoWithdrawal(amount, walletAddress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cryptoWithdrawals'] });
      toast.success('Withdrawal request submitted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit withdrawal: ${error.message}`);
    },
  });
}

export function useGetCompleteBankDetails() {
  const { actor, isFetching } = useActor();

  return useQuery<BankDetailsWithoutNetBankingV1 | null>({
    queryKey: ['completeBankDetails'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.getCompleteBankDetails();
      return result ?? null;
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    gcTime: 0,
    retry: false,
  });
}

export function useSaveCompleteBankDetails() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (details: BankDetailsWithoutNetBanking) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.saveCompleteBankDetails(details);

      if (result.__kind__ === 'error') {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completeBankDetails'] });
      queryClient.invalidateQueries({ queryKey: ['allBankAccounts'] });
    },
    onError: (error: Error) => {
      console.error('Failed to save bank details:', error.message);
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    gcTime: 0,
  });
}

export function useSetAllInrBalancesToDefault() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<SetAllInrBalancesResult, Error>({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.setAllInrBalancesToDefault();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success(`Successfully updated ${result.updatedCount} user(s) to ₹${Number(result.defaultBalance).toFixed(2)}`);
    },
    onError: (error: Error) => {
      if (error.message.includes('Unauthorized')) {
        toast.error('Unauthorized: Only admins can perform this action');
      } else {
        toast.error(`Failed to update balances: ${error.message}`);
      }
    },
  });
}

export function useGetAllCompleteBankDetails() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[Principal, BankDetailsWithoutNetBankingV1]>>({
    queryKey: ['allCompleteBankDetails'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCompleteBankDetails() as Promise<Array<[Principal, BankDetailsWithoutNetBankingV1]>>;
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    gcTime: 0,
  });
}

export function useUpdateBankAccountStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ withdrawalId, newStatus }: { withdrawalId: bigint; newStatus: BankAccountStatus }) => {
      if (!actor) throw new Error('Actor not available');
      const bankStatus = newStatus === BankAccountStatus.liveActive
        ? { __kind__: 'liveActive' as const }
        : newStatus === BankAccountStatus.rejected
        ? { __kind__: 'rejected' as const }
        : { __kind__: 'pending' as const };
      return actor.updateBankWithdrawalStatus(withdrawalId, bankStatus as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completeBankDetails'] });
      queryClient.invalidateQueries({ queryKey: ['allCompleteBankDetails'] });
      toast.success('Bank account status updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });
}

// Fetch all bank accounts (public — no auth required)
export function useGetAllBankAccounts() {
  const { actor, isFetching } = useActor();

  return useQuery<BankDetailsWithoutNetBanking[]>({
    queryKey: ['allBankAccounts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBankAccounts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    gcTime: 0,
    retry: false,
  });
}
