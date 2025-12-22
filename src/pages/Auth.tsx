import { useEffect } from "react";
import { motion } from "framer-motion";
import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useUser();

  // Redirect if already logged in
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 px-4 overflow-y-auto">
        <div className="container max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="overflow-visible">
              <CardContent className="p-4 sm:p-6">
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin" className="flex justify-center min-h-[400px]">
                    <SignIn 
                      appearance={{
                        elements: {
                          rootBox: "w-full",
                          card: "shadow-none p-0 bg-transparent w-full",
                          headerTitle: "hidden",
                          headerSubtitle: "hidden",
                          socialButtonsBlockButton: "border border-border bg-background hover:bg-muted",
                          formButtonPrimary: "bg-primary hover:bg-primary/90",
                          footerActionLink: "text-primary hover:text-primary/80",
                          formFieldInput: "bg-background border-border",
                          footer: "hidden",
                        }
                      }}
                      routing="hash"
                      signUpUrl="/auth#signup"
                      forceRedirectUrl="/dashboard"
                    />
                  </TabsContent>
                  
                  <TabsContent value="signup" className="flex justify-center min-h-[500px]">
                    <SignUp 
                      appearance={{
                        elements: {
                          rootBox: "w-full",
                          card: "shadow-none p-0 bg-transparent w-full",
                          headerTitle: "hidden",
                          headerSubtitle: "hidden",
                          socialButtonsBlockButton: "border border-border bg-background hover:bg-muted",
                          formButtonPrimary: "bg-primary hover:bg-primary/90",
                          footerActionLink: "text-primary hover:text-primary/80",
                          formFieldInput: "bg-background border-border",
                          footer: "hidden",
                        }
                      }}
                      routing="hash"
                      signInUrl="/auth#signin"
                      forceRedirectUrl="/dashboard"
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuthPage;
