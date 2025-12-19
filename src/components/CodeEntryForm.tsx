import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, CheckCircle, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { validCodes } from "@/lib/mockData";
import confetti from "canvas-confetti";

interface CodeEntryFormProps {
  onSuccess?: () => void;
}

const CodeEntryForm = ({ onSuccess }: CodeEntryFormProps) => {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55, colors: ['#e53935', '#ffc107', '#4caf50'] });
    fire(0.2, { spread: 60, colors: ['#e53935', '#ffc107'] });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#ffc107', '#4caf50'] });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ['#e53935'] });
    fire(0.1, { spread: 120, startVelocity: 45, colors: ['#4caf50', '#ffc107'] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setStatus("loading");
    setErrorMessage("");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const foundCode = validCodes.find(
      (c) => c.code.toLowerCase() === code.trim().toLowerCase()
    );

    if (!foundCode) {
      setStatus("error");
      setErrorMessage("Invalid code. Please check and try again.");
      return;
    }

    if (foundCode.isRedeemed) {
      setStatus("error");
      setErrorMessage("This code has already been used.");
      return;
    }

    setStatus("success");
    triggerConfetti();
    onSuccess?.();
  };

  const resetForm = () => {
    setCode("");
    setStatus("idle");
    setErrorMessage("");
  };

  return (
    <Card className="max-w-md mx-auto overflow-hidden">
      <CardHeader className="text-center bg-gradient-to-br from-cream to-background pb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-glow-primary"
        >
          <Gift className="w-10 h-10 text-primary-foreground" />
        </motion.div>
        <CardTitle className="text-2xl">Enter Your Lucky Code</CardTitle>
        <CardDescription>
          Find the unique code inside your Shareat snack pack
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center shadow-glow-success"
              >
                <CheckCircle className="w-12 h-12 text-accent-foreground" />
              </motion.div>
              <h3 className="font-display font-bold text-2xl text-foreground mb-2">
                You're In! 🎉
              </h3>
              <p className="text-muted-foreground mb-6">
                Your entry has been submitted successfully. Good luck!
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-accent font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Entry #{Math.floor(Math.random() * 1000) + 1} this month</span>
              </div>
              <Button onClick={resetForm} variant="outline" className="mt-6">
                Enter Another Code
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <Input
                  type="text"
                  placeholder="Enter your unique code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="text-center text-lg font-mono tracking-wider uppercase"
                  disabled={status === "loading"}
                />
              </div>

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errorMessage}
                </motion.div>
              )}

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={status === "loading" || !code.trim()}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <Gift className="w-5 h-5" />
                    Enter the Draw
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Try codes: LUCKY123, WIN2024, SHAREAT2024A1
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default CodeEntryForm;
