import { useState } from "react";
import { Ticket, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSubmitCode } from "@/hooks/useDrawData";
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import confetti from "canvas-confetti";

interface CodeEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CodeEntryDialog = ({ open, onOpenChange }: CodeEntryDialogProps) => {
  const [code, setCode] = useState("");
  const { toast } = useToast();
  const submitCode = useSubmitCode();
  const { getToken } = useClerkAuth();

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive",
      });
      return;
    }

    const token = await getToken();
    if (!token) {
      toast({
        title: "Error",
        description: "Please log in to redeem a code",
        variant: "destructive",
      });
      return;
    }

    submitCode.mutate({ code: code.trim().toUpperCase(), token }, {
      onSuccess: () => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#E53935", "#FFB300", "#43A047"],
        });
        toast({
          title: "Success!",
          description: "Your code has been redeemed successfully!",
        });
        setCode("");
        onOpenChange(false);
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Failed to redeem code",
          variant: "destructive",
        });
      },
    });
  };

  const handleCancel = () => {
    setCode("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-display">
            <Ticket className="w-6 h-6 text-primary" />
            Redeem Coupon Code
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <p className="text-muted-foreground">
            Enter your coupon code to earn bonus points!
          </p>
          
          <Input
            placeholder="ENTER YOUR COUPON CODE"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="text-center text-lg tracking-widest font-mono border-2 border-primary/30 focus:border-primary h-14 uppercase"
            disabled={submitCode.isPending}
          />
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
              disabled={submitCode.isPending}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-primary to-primary/80"
              onClick={handleSubmit}
              disabled={submitCode.isPending || !code.trim()}
            >
              {submitCode.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Redeeming...
                </>
              ) : (
                "Redeem Code"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodeEntryDialog;
