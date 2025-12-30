import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Gift, Star, Filter, Loader2, Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/ClerkAuthContext";
import { useCurrentPrize, useCurrentGrandPrize } from "@/hooks/useDrawData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

type FilterType = "all" | "exclusive" | "current";

const Rewards = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const { data: currentPrize, isLoading: prizeLoading } = useCurrentPrize();
  const { data: grandPrize } = useCurrentGrandPrize();

  const handleEnterDraw = () => {
    navigate("/dashboard", { state: { openCodeDialog: true } });
  };

  // Fetch all active prizes
  const { data: allPrizes, isLoading: allPrizesLoading } = useQuery({
    queryKey: ["all-prizes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prizes")
        .select("*")
        .eq("is_active", true)
        .order("month", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const currentMonth = format(new Date(), "yyyy-MM");
  
  const filteredPrizes = allPrizes?.filter(prize => {
    if (activeFilter === "current") {
      const prizeMonth = format(new Date(prize.month), "yyyy-MM");
      return prizeMonth === currentMonth;
    }
    return true;
  }) || [];

  const isLoading = prizeLoading || allPrizesLoading;

  const filters = [
    { id: "all" as FilterType, label: "All Rewards", icon: Gift },
    { id: "exclusive" as FilterType, label: "Exclusive", icon: Star },
    { id: "current" as FilterType, label: "Current Month", icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">
                <span className="text-foreground">Rewards </span>
                <span className="text-primary">Shop</span>
              </h1>
              <p className="text-muted-foreground mt-2">
                View this month's exciting prizes up for grabs
              </p>
            </div>
            
            {/* Points Card */}
            <Card className="border border-border w-fit">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Your Entries</p>
                  <div className="flex items-center gap-2 justify-end">
                    <Gift className="w-5 h-5 text-primary" />
                    <span className="text-2xl font-bold text-foreground">
                      {user ? "Active" : "0"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <Filter className="w-5 h-5 text-muted-foreground" />
                  {filters.map((filter) => (
                    <Button
                      key={filter.id}
                      variant={activeFilter === filter.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter(filter.id)}
                      className="gap-2"
                    >
                      <filter.icon className="w-4 h-4" />
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Prizes Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredPrizes.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPrizes.map((prize, index) => {
                const prizeMonth = format(new Date(prize.month), "yyyy-MM");
                const isCurrentMonth = prizeMonth === currentMonth;
                
                return (
                  <motion.div
                    key={prize.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card className={`overflow-hidden border border-border hover:shadow-lg transition-shadow ${prize.is_grand_prize ? 'ring-2 ring-yellow-500 ring-offset-2' : ''}`}>
                      {/* Prize Image */}
                      <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                        {prize.image_url ? (
                          <img 
                            src={prize.image_url} 
                            alt={prize.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Gift className="w-16 h-16 text-muted-foreground/50" />
                          </div>
                        )}
                        
                        {/* Grand Prize Badge */}
                        {prize.is_grand_prize && (
                          <div className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
                            <Crown className="w-3 h-3" />
                            Grand Prize
                          </div>
                        )}
                        
                        {/* Badge */}
                        <Badge 
                          variant="secondary" 
                          className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm"
                        >
                          {isCurrentMonth ? (
                            <>
                              <Star className="w-3 h-3 mr-1" />
                              Current Month
                            </>
                          ) : (
                            <>
                              <Gift className="w-3 h-3 mr-1" />
                              {format(new Date(prize.month), "MMM yyyy")}
                            </>
                          )}
                        </Badge>

                        {/* Points Badge */}
                        <Badge 
                          className="absolute bottom-3 right-3 bg-primary text-primary-foreground"
                        >
                          <Gift className="w-3 h-3 mr-1" />
                          Lucky Draw
                        </Badge>
                      </div>

                      {/* Prize Details */}
                      <CardContent className="p-4">
                        <h3 className="font-display font-bold text-lg text-foreground mb-1">
                          {prize.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {prize.description || prize.name}
                        </p>
                        <p className="text-xs text-accent font-medium mb-3">
                          {isCurrentMonth ? "Available this month!" : `Draw: ${format(new Date(prize.month), "MMMM yyyy")}`}
                        </p>
                        
                        <Button 
                          variant="outline" 
                          className="w-full border-primary/30 text-primary hover:bg-primary/5"
                          onClick={handleEnterDraw}
                        >
                          Enter Draw to Win
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <Gift className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-2">
                No Prizes Available
              </h3>
              <p className="text-muted-foreground mb-6">
                Check back soon for exciting new prizes!
              </p>
            </motion.div>
          )}

          {/* Current Month Highlight - Show Grand Prize if available, otherwise current prize */}
          {(grandPrize || currentPrize) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12"
            >
              <Card className="overflow-hidden bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-white ring-4 ring-yellow-300/50 ring-offset-2">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-center gap-6">
                      {(grandPrize || currentPrize)?.image_url && (
                        <div className="hidden md:block w-24 h-24 rounded-xl overflow-hidden border-4 border-white/30 shadow-xl flex-shrink-0">
                          <img 
                            src={(grandPrize || currentPrize)?.image_url || ''} 
                            alt={(grandPrize || currentPrize)?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <Badge className="mb-3 bg-white/20 text-white border-white/30 hover:bg-white/30">
                          <Crown className="w-3 h-3 mr-1" />
                          This Month's Grand Prize
                        </Badge>
                        <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
                          {(grandPrize || currentPrize)?.name}
                        </h2>
                        <p className="text-white/80">
                          {(grandPrize || currentPrize)?.description || "Enter the lucky draw for a chance to win!"}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="lg"
                      className="bg-white text-amber-600 hover:bg-white/90 font-bold shadow-lg"
                      onClick={handleEnterDraw}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Enter Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Rewards;
