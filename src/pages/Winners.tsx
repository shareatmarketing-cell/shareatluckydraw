import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trophy, Calendar, Gift, Ticket, Loader2, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/ClerkAuthContext";
import { useUserEntries, usePublicWinners } from "@/hooks/useDrawData";
import { format } from "date-fns";

const History = () => {
  const { user } = useAuth();
  const { data: entries, isLoading: entriesLoading } = useUserEntries();
  const { data: winners, isLoading: winnersLoading } = usePublicWinners();

  const isLoading = entriesLoading || winnersLoading;

  // Group entries by year
  const groupedEntries = entries?.reduce((acc, entry) => {
    const year = format(new Date(entry.month), "yyyy");
    if (!acc[year]) acc[year] = [];
    acc[year].push(entry);
    return acc;
  }, {} as Record<string, typeof entries>) || {};

  // Group winners by month
  const groupedWinners = winners?.reduce((acc, winner) => {
    const monthYear = format(new Date(winner.month), "MMMM yyyy");
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(winner);
    return acc;
  }, {} as Record<string, typeof winners>) || {};

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              History
            </h1>
            <p className="text-muted-foreground">
              View your lucky draw entries and past winners
            </p>
          </motion.div>

          <Tabs defaultValue="my-entries" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="my-entries" className="gap-2">
                <Ticket className="w-4 h-4" />
                My Entries
              </TabsTrigger>
              <TabsTrigger value="winners" className="gap-2">
                <Trophy className="w-4 h-4" />
                Winners
              </TabsTrigger>
            </TabsList>

            {/* My Entries Tab */}
            <TabsContent value="my-entries">
              {!user ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Ticket className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-foreground mb-2">
                    Login to View Your Entries
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Sign in to see your lucky draw entry history
                  </p>
                  <Link to="/auth">
                    <Button>Login Now</Button>
                  </Link>
                </motion.div>
              ) : isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : entries && entries.length > 0 ? (
                <div className="space-y-8">
                  {Object.entries(groupedEntries)
                    .sort(([a], [b]) => Number(b) - Number(a))
                    .map(([year, yearEntries], groupIndex) => (
                    <motion.div
                      key={year}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: groupIndex * 0.1 }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Calendar className="w-5 h-5 text-primary" />
                        <h2 className="font-display font-bold text-xl text-foreground">{year}</h2>
                      </div>
                      
                      <div className="space-y-3">
                        {yearEntries?.sort((a, b) => 
                          new Date(b.month).getTime() - new Date(a.month).getTime()
                        ).map((entry, index) => {
                          const entryMonth = new Date(entry.month);
                          const currentMonth = new Date();
                          const isCurrentMonth = 
                            entryMonth.getMonth() === currentMonth.getMonth() && 
                            entryMonth.getFullYear() === currentMonth.getFullYear();
                          const isPastMonth = entryMonth < currentMonth && !isCurrentMonth;
                          
                          return (
                            <motion.div
                              key={entry.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: groupIndex * 0.1 + index * 0.05 }}
                            >
                              <Card className="overflow-hidden">
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                      isCurrentMonth 
                                        ? 'bg-primary/10' 
                                        : isPastMonth 
                                          ? 'bg-accent/10' 
                                          : 'bg-muted'
                                    }`}>
                                      {isCurrentMonth ? (
                                        <Clock className="w-6 h-6 text-primary" />
                                      ) : (
                                        <CheckCircle className="w-6 h-6 text-accent" />
                                      )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-display font-bold text-foreground">
                                        {format(entryMonth, "MMMM yyyy")} Draw
                                      </h3>
                                      <p className="text-sm text-muted-foreground">
                                        Entered on {format(new Date(entry.created_at), "MMM d, yyyy 'at' h:mm a")}
                                      </p>
                                    </div>
                                    
                                    <div className="flex-shrink-0">
                                      <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                                        isCurrentMonth 
                                          ? 'bg-primary/10 text-primary' 
                                          : isPastMonth 
                                            ? 'bg-accent/10 text-accent' 
                                            : 'bg-muted text-muted-foreground'
                                      }`}>
                                        {isCurrentMonth ? 'Active' : isPastMonth ? 'Completed' : 'Upcoming'}
                                      </span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Ticket className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-foreground mb-2">
                    No Entries Yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't entered any lucky draws yet. Enter your first code!
                  </p>
                  <Link to="/dashboard">
                    <Button>Enter a Code</Button>
                  </Link>
                </motion.div>
              )}
            </TabsContent>

            {/* Winners Tab */}
            <TabsContent value="winners">
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : winners && winners.length > 0 ? (
                <div className="space-y-8">
                  {Object.entries(groupedWinners).map(([monthYear, monthWinners], groupIndex) => (
                    <motion.div
                      key={monthYear}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: groupIndex * 0.1 }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Trophy className="w-5 h-5 text-secondary" />
                        <h2 className="font-display font-bold text-xl text-foreground">{monthYear}</h2>
                      </div>
                      
                      <div className="space-y-3">
                        {monthWinners?.map((winner, index) => (
                          <motion.div
                            key={winner.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: groupIndex * 0.1 + index * 0.05 }}
                          >
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center text-xl">
                                    🏆
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-display font-bold text-foreground">
                                      {winner.profiles?.full_name || 'Lucky Winner'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      Won on {format(new Date(winner.created_at), "MMM d, yyyy")}
                                    </p>
                                  </div>
                                  
                                  <div className="flex-shrink-0">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/10 border border-secondary/20">
                                      <Gift className="w-4 h-4 text-secondary" />
                                      <span className="font-semibold text-sm text-foreground">
                                        {winner.prizes?.name || 'Prize'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-foreground mb-2">
                    No Winners Yet
                  </h3>
                  <p className="text-muted-foreground">
                    Winners will be announced after each monthly draw
                  </p>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default History;
