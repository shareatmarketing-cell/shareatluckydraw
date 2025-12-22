import { useEffect } from "react";
import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuthPage = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/dashboard");
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="flex justify-center">
              <SignIn
                routing="hash"
                forceRedirectUrl="/dashboard"
                signUpUrl="/auth#signup"
              />
            </TabsContent>

            <TabsContent value="signup" className="flex justify-center">
              <SignUp
                routing="hash"
                forceRedirectUrl="/dashboard"
                signInUrl="/auth#signin"
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuthPage;
