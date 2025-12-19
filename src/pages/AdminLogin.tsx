import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock admin credentials
    if (email === "admin@shareat.com" && password === "admin123") {
      navigate("/admin/dashboard");
    } else {
      setError("Invalid credentials. Try admin@shareat.com / admin123");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-foreground flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-br from-cream to-background pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-foreground flex items-center justify-center"
            >
              <Lock className="w-8 h-8 text-background" />
            </motion.div>
            <CardTitle className="text-2xl">Admin Portal</CardTitle>
            <CardDescription>
              Login to manage the Shareat Lucky Draw
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-destructive text-center"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full bg-foreground text-background hover:bg-foreground/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Access Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-4 text-xs text-center text-muted-foreground">
              Demo: admin@shareat.com / admin123
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
