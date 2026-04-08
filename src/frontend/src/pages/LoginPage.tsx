import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocalAuth } from "../hooks/useLocalAuth";

export default function LoginPage() {
  const { login, signup } = useLocalAuth();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showLoginSpinner, setShowLoginSpinner] = useState(false);

  // Signup form state
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showSignupSpinner, setShowSignupSpinner] = useState(false);

  // Refs for spinner timers
  const loginTimerRef = useRef<NodeJS.Timeout | null>(null);
  const signupTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (loginTimerRef.current) clearTimeout(loginTimerRef.current);
      if (signupTimerRef.current) clearTimeout(signupTimerRef.current);
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Silent validation - do nothing if fields are empty
    if (!loginEmail.trim() || !loginPassword.trim()) {
      return;
    }

    setIsLoggingIn(true);

    // Show spinner only if login takes more than 1 second
    loginTimerRef.current = setTimeout(() => {
      setShowLoginSpinner(true);
    }, 1000);

    // Use setTimeout to ensure UI updates before sync operation
    setTimeout(() => {
      try {
        const success = login(loginEmail.trim(), loginPassword);

        // Clear timer and hide spinner
        if (loginTimerRef.current) {
          clearTimeout(loginTimerRef.current);
          loginTimerRef.current = null;
        }
        setShowLoginSpinner(false);

        if (!success) {
          // Fail silently - just reset loading state
          setIsLoggingIn(false);
        }
        // On success, App.tsx will detect auth state change and render MainApp
      } catch {
        if (loginTimerRef.current) {
          clearTimeout(loginTimerRef.current);
          loginTimerRef.current = null;
        }
        setShowLoginSpinner(false);
        setIsLoggingIn(false);
      }
    }, 0);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    // Silent validation - do nothing if fields are empty or password too short
    if (
      !signupUsername.trim() ||
      !signupEmail.trim() ||
      !signupPassword.trim()
    ) {
      return;
    }

    if (signupPassword.length < 6) {
      return;
    }

    setIsSigningUp(true);

    // Show spinner only if signup takes more than 1 second
    signupTimerRef.current = setTimeout(() => {
      setShowSignupSpinner(true);
    }, 1000);

    // Use setTimeout to ensure UI updates before sync operation
    setTimeout(() => {
      try {
        const success = signup(
          signupUsername.trim(),
          signupEmail.trim(),
          signupPassword,
        );

        // Clear timer and hide spinner
        if (signupTimerRef.current) {
          clearTimeout(signupTimerRef.current);
          signupTimerRef.current = null;
        }
        setShowSignupSpinner(false);

        if (!success) {
          // Fail silently - just reset loading state
          setIsSigningUp(false);
        }
        // On success, App.tsx will detect auth state change and render MainApp
      } catch {
        if (signupTimerRef.current) {
          clearTimeout(signupTimerRef.current);
          signupTimerRef.current = null;
        }
        setShowSignupSpinner(false);
        setIsSigningUp(false);
      }
    }, 0);
  };

  return (
    <div className="min-h-screen bg-[#0B1C14] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <img
            src="/assets/generated/xinpay-logo.dim_200x200.png"
            alt="XinPay Logo"
            className="h-20 w-20 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-[#00E5FF]">XinPay</h1>
          <p className="text-gray-400">Professional Financial Management</p>
        </div>

        <Card className="bg-[#1C2431] border-[#00E5FF]/20">
          <CardHeader>
            <CardTitle className="text-[#00E5FF]">Welcome</CardTitle>
            <CardDescription className="text-gray-400">
              {activeTab === "login"
                ? "Sign in to your account"
                : "Create your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "login" | "signup")}
            >
              <TabsList className="grid w-full grid-cols-2 bg-[#0B1C14]">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-[#00E5FF] data-[state=active]:text-[#0B1C14]"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-[#00E5FF] data-[state=active]:text-[#0B1C14]"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-gray-300">
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="bg-[#0B1C14] border-[#00E5FF]/30 text-white placeholder:text-gray-500"
                      disabled={isLoggingIn}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-gray-300">
                      Password
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="bg-[#0B1C14] border-[#00E5FF]/30 text-white placeholder:text-gray-500"
                      disabled={isLoggingIn}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-[#0B1C14] font-semibold"
                    disabled={isLoggingIn}
                  >
                    {showLoginSpinner && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isLoggingIn ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-username" className="text-gray-300">
                      Username
                    </Label>
                    <Input
                      id="signup-username"
                      type="text"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="bg-[#0B1C14] border-[#00E5FF]/30 text-white placeholder:text-gray-500"
                      disabled={isSigningUp}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-gray-300">
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="bg-[#0B1C14] border-[#00E5FF]/30 text-white placeholder:text-gray-500"
                      disabled={isSigningUp}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-gray-300">
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="bg-[#0B1C14] border-[#00E5FF]/30 text-white placeholder:text-gray-500"
                      disabled={isSigningUp}
                    />
                    <p className="text-xs text-gray-500">
                      Must be at least 6 characters
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-[#0B1C14] font-semibold"
                    disabled={isSigningUp}
                  >
                    {showSignupSpinner && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isSigningUp ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Your data is securely stored
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
