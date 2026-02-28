import { useLocalAuth } from './hooks/useLocalAuth';
import LoginPage from './pages/LoginPage';
import MainApp from './components/MainApp';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      staleTime: 0,
      gcTime: 0,
    },
  },
});

export default function App() {
  const { isAuthenticated, userProfile, isLoading } = useLocalAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1C14] flex items-center justify-center">
        <div className="text-center space-y-4">
          <img
            src="/assets/generated/xinpay-logo.dim_200x200.png"
            alt="XinPay Logo"
            className="h-20 w-20 mx-auto animate-pulse"
          />
          <p className="text-[#00E5FF] text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      {isAuthenticated && userProfile ? (
        <MainApp userProfile={userProfile} />
      ) : (
        <LoginPage />
      )}
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
