import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { 
  Gift, 
  TrendingUp, 
  Star, 
  Calendar, 
  ArrowRight, 
  Loader2,
  CheckSquare,
  ExternalLink,
  Ticket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CodeEntryDialog from "@/components/CodeEntryDialog";
import { useAuth } from "@/contexts/ClerkAuthContext";
import { useUserEntries } from "@/hooks/useDrawData";
import { format } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, isAdmin, isLoading: authLoading, isSignedIn } = useAuth();
  const { data: entries, isLoading: entriesLoading } = useUserEntries();
  const [codeDialogOpen, setCodeDialogOpen] = useState(() => {
    return location.state?.openCodeDialog || false;
  });

  // Auth bypass: don't redirect or block rendering when Clerk can't load

  const memberSince = user?.created_at 
    ? format(new Date(user.created_at), "MMM yyyy")
    : format(new Date(), "MMM yyyy");

  const totalEntries = entries?.length || 0;
  const currentMonthEntries = entries?.filter(e => {
    const entryMonth = new Date(e.month).getMonth();
    const currentMonth = new Date().getMonth();
    return entryMonth === currentMonth;
  }).length || 0;

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitials = userName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
          >
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-4 border-primary/20">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  Welcome, {userName}!
                </h1>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {isAdmin && (
                <Link to="/admin/dashboard">
                  <Button variant="outline" className="gap-2">
                    Admin Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                onClick={() => setCodeDialogOpen(true)}
              >
                <Ticket className="w-4 h-4" />
                Redeem Coupon Code
              </Button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          >
            <Card className="border border-border">
              <CardContent className="p-5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Gift className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground">{currentMonthEntries}</p>
                <p className="text-sm text-muted-foreground">Current Month Tickets</p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-5">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <p className="text-3xl font-bold text-foreground">{totalEntries}</p>
                <p className="text-sm text-muted-foreground">Total Entries</p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-5">
                <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center mb-3">
                  <Star className="w-5 h-5 text-secondary-foreground" />
                </div>
                <p className="text-3xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Rewards Won</p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-5">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
                  <Calendar className="w-5 h-5 text-foreground" />
                </div>
                <p className="text-2xl font-bold text-foreground">{memberSince}</p>
                <p className="text-sm text-muted-foreground">Member Since</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 gap-4 mb-6"
          >
            {/* Explore Rewards Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
              <div className="relative z-10">
                <h3 className="text-xl font-display font-bold mb-2">Explore Rewards</h3>
                <p className="text-primary-foreground/80 text-sm mb-4">
                  Browse exclusive rewards and view this month's prizes
                </p>
                <Link to="/rewards">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="bg-card text-foreground hover:bg-card/90 gap-2"
                  >
                    View Prizes <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <Gift className="absolute right-4 bottom-4 w-24 h-24 text-primary-foreground/20" />
            </div>

            {/* Have a Coupon Card */}
            <div className="relative overflow-hidden rounded-2xl bg-secondary/20 border border-secondary/30 p-6">
              <div className="relative z-10">
                <h3 className="text-xl font-display font-bold text-foreground mb-2">Have a Coupon?</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Enter your coupon code to join the lucky draw
                </p>
                <Button 
                  variant="default"
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                  onClick={() => setCodeDialogOpen(true)}
                >
                  <Ticket className="w-4 h-4" />
                  Enter Code
                </Button>
              </div>
              <Ticket className="absolute right-4 bottom-4 w-24 h-24 text-secondary/30" />
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckSquare className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-bold text-foreground">Quick Links</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  <Link 
                    to="/winners"
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    <div>
                      <p className="font-semibold text-foreground">Winners Board</p>
                      <p className="text-sm text-muted-foreground">See past winners</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>

                  <button 
                    onClick={() => setCodeDialogOpen(true)}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group text-left"
                  >
                    <div>
                      <p className="font-semibold text-foreground">Enter Draw</p>
                      <p className="text-sm text-muted-foreground">Submit your code</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>

                  <a 
                    href="https://shareatfoods.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    <div>
                      <p className="font-semibold text-primary">Shop Now</p>
                      <p className="text-sm text-muted-foreground">Visit Shareat Foods store</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Entry History */}
          {entries && entries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h3 className="font-display font-bold text-foreground">Entry History</h3>
                  </div>
                  <div className="space-y-3">
                    {entries.slice(0, 5).map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                            <Ticket className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {format(new Date(entry.month), "MMMM yyyy")} Draw
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Entered on {format(new Date(entry.created_at), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full bg-accent/20 text-accent font-medium">
                          Entered
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />

      {/* Code Entry Dialog */}
      <CodeEntryDialog open={codeDialogOpen} onOpenChange={setCodeDialogOpen} />
    </div>
  );
};

export default Dashboard;
