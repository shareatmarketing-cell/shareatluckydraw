import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { ClerkAuthProvider } from "@/contexts/ClerkAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import Index from "./pages/Index";
import AuthPage from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Winners from "./pages/Winners";
import Rewards from "./pages/Rewards";
import Profile from "./pages/Profile";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ENV_KEY = (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined) || "";
const LOCAL_KEY_NAME = "CLERK_PUBLISHABLE_KEY";

const MissingClerkKey = ({
  value,
  onSave,
}: {
  value: string;
  onSave: (key: string) => void;
}) => {
  const [input, setInput] = useState(value);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="font-display">Clerk key required</CardTitle>
          <CardDescription>
            Your app is missing the Clerk publishable key. Paste a key that starts with{' '}
            <span className="font-mono">pk_</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="pk_..."
            autoComplete="off"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="default"
              onClick={() => {
                const trimmed = input.trim();
                if (!trimmed) return;
                onSave(trimmed);
              }}
            >
              Save key & reload
            </Button>
            <Link to="/">
              <Button variant="outline" className="w-full sm:w-auto">Back to home</Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            This key is public and safe to store client-side. Once saved, we’ll use it to
            initialize Clerk.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </>
);

const App = () => {
  const storedKey = useMemo(() => {
    try {
      return localStorage.getItem(LOCAL_KEY_NAME) || "";
    } catch {
      return "";
    }
  }, []);

  const [clerkKey, setClerkKey] = useState<string>(ENV_KEY || storedKey);

  useEffect(() => {
    // If ENV becomes available later, prefer it.
    if (ENV_KEY && ENV_KEY !== clerkKey) setClerkKey(ENV_KEY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!clerkKey) {
    return (
      <MissingClerkKey
        value={storedKey}
        onSave={(key) => {
          try {
            localStorage.setItem(LOCAL_KEY_NAME, key);
          } catch {
            // ignore
          }
          // Force reload so ClerkProvider gets a clean init.
          window.location.reload();
        }}
      />
    );
  }

  return (
    <ClerkProvider publishableKey={clerkKey}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ClerkAuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/winners" element={<Winners />} />
                  <Route path="/rewards" element={<Rewards />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ClerkAuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ClerkProvider>
  );
};

export default App;
