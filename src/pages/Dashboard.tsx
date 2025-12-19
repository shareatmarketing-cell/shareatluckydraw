import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { User, Gift, Trophy, Calendar, CheckCircle, Clock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useUserEntries, useCurrentPrize, usePublicWinners, useHasEnteredThisMonth } from "@/hooks/useDrawData";
import { format } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading: authLoading, signOut } = useAuth();
  const { data: entries, isLoading: entriesLoading } = useUserEntries();
  const { data: currentPrize } = useCurrentPrize();
  const { data: winners } = usePublicWinners();
  const { data: hasEntered } = useHasEnteredThisMonth();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentMonth = format(new Date(), "MMMM yyyy");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}!
            </h1>
            <p className="text-muted-foreground">
              Manage your lucky draw entries and check your status
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="w-5 h-5 text-primary" />
                    Your Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Name:</span> {profile?.full_name || 'Not set'}</p>
                    <p><span className="text-muted-foreground">Email:</span> {user.email}</p>
                    <p><span className="text-muted-foreground">Phone:</span> {profile?.phone || 'Not set'}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4 w-full"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Current Month Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className={hasEntered ? "border-accent/50 bg-accent/5" : ""}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                    {currentMonth} Draw
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {hasEntered ? (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">You're entered!</p>
                        <p className="text-sm text-muted-foreground">Good luck in the draw</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <Clock className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Not entered yet</p>
                        <Link to="/enter" className="text-sm text-primary hover:underline">
                          Enter now →
                        </Link>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Current Prize */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-secondary/50 bg-secondary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Gift className="w-5 h-5 text-secondary" />
                    This Month's Prize
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentPrize ? (
                    <div>
                      <p className="font-display font-bold text-xl text-foreground mb-1">
                        {currentPrize.name}
                      </p>
                      {currentPrize.description && (
                        <p className="text-sm text-muted-foreground">{currentPrize.description}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No prize set for this month</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Entry History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Your Entry History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {entriesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : entries && entries.length > 0 ? (
                  <div className="space-y-3">
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {format(new Date(entry.month), "MMMM yyyy")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Entered on {format(new Date(entry.created_at), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent font-medium">
                          Entered
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't entered any draws yet</p>
                    <Link to="/enter">
                      <Button variant="hero">
                        Enter Your First Code
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Winners */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-secondary" />
                    Recent Winners
                  </CardTitle>
                  <Link to="/winners">
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {winners && winners.length > 0 ? (
                  <div className="space-y-3">
                    {winners.slice(0, 5).map((winner, index) => (
                      <div
                        key={winner.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            index === 0 ? "bg-secondary/20 text-secondary" : "bg-muted text-muted-foreground"
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {winner.profiles?.full_name || 'Anonymous'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {winner.prizes?.name || 'Prize'}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(winner.month), "MMM yyyy")}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No winners announced yet
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
