import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { ClerkAuthProvider } from "@/contexts/ClerkAuthContext";
import Index from "./pages/Index";
import AuthPage from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Winners from "./pages/Winners";
import Rewards from "./pages/Rewards";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Note: frontend env vars may not always be injected in preview builds.
// Clerk publishable keys are safe to ship client-side.
const CLERK_PUBLISHABLE_KEY =
  (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined)?.trim() ||
  "pk_test_cHJvbXB0LWdlbGRpbmctMTMuY2xlcmsuYWNjb3VudHMuZGV2JA";

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
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
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
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
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
