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
        <div className="w-full max-w-[520px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="overflow-visible border-0 sm:border shadow-none sm:shadow-sm">
              <CardContent className="p-0 overflow-visible">
                <div className="px-4 sm:px-8 py-4 sm:py-6 overflow-visible">
                  <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="signin">Sign In</TabsTrigger>
                      <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="signin" className="overflow-visible">
                      <div className="w-full overflow-visible">
                        <SignIn
                          appearance={{
                            elements: {
                              rootBox: "w-full max-w-full overflow-visible",
                              card: "shadow-none p-0 bg-transparent w-full max-w-full overflow-visible",
                              main: "w-full max-w-full",
                              headerTitle: "hidden",
                              headerSubtitle: "hidden",
                              socialButtonsBlockButton:
                                "border border-border bg-background hover:bg-muted w-full",
                              formButtonPrimary: "bg-primary hover:bg-primary/90 w-full",
                              footerActionLink: "text-primary hover:text-primary/80",
                              formFieldInput: "bg-background border-border w-full",
                              footer: "hidden",
                              form: "w-full",
                              formFieldRow: "w-full",
                            },
                          }}
                          routing="hash"
                          signUpUrl="/auth#signup"
                          forceRedirectUrl="/dashboard"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="signup" className="overflow-visible">
                      <div className="w-full overflow-visible">
                        <SignUp
                          appearance={{
                            elements: {
                              rootBox: "w-full max-w-full overflow-visible",
                              card: "shadow-none p-0 bg-transparent w-full max-w-full overflow-visible",
                              main: "w-full max-w-full",
                              headerTitle: "hidden",
                              headerSubtitle: "hidden",
                              socialButtonsBlockButton:
                                "border border-border bg-background hover:bg-muted w-full",
                              formButtonPrimary: "bg-primary hover:bg-primary/90 w-full",
                              footerActionLink: "text-primary hover:text-primary/80",
                              formFieldInput: "bg-background border-border w-full",
                              footer: "hidden",
                              form: "w-full",
                              formFieldRow: "w-full",
                            },
                          }}
                          routing="hash"
                          signInUrl="/auth#signin"
                          forceRedirectUrl="/dashboard"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
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
