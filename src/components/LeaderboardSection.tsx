import { motion } from "framer-motion";
import { Trophy, Medal, Award, Gift, Sparkles, Crown, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePublicWinners } from "@/hooks/useDrawData";
import { format } from "date-fns";

const getRankIcon = (index: number) => {
  switch (index) {
    case 0:
      return <Crown className="w-6 h-6 text-yellow-500 drop-shadow-lg" />;
    case 1:
      return <Medal className="w-5 h-5 text-slate-400" />;
    case 2:
      return <Award className="w-5 h-5 text-amber-600" />;
    default:
      return <Gift className="w-5 h-5 text-primary" />;
  }
};

const getRankStyles = (index: number) => {
  switch (index) {
    case 0:
      return {
        bg: "bg-gradient-to-r from-yellow-500/20 via-amber-400/10 to-yellow-500/5",
        border: "border-l-4 border-yellow-500",
        glow: "shadow-[inset_0_0_20px_rgba(234,179,8,0.1)]",
      };
    case 1:
      return {
        bg: "bg-gradient-to-r from-slate-400/15 to-slate-400/5",
        border: "border-l-4 border-slate-400",
        glow: "",
      };
    case 2:
      return {
        bg: "bg-gradient-to-r from-amber-600/15 to-amber-600/5",
        border: "border-l-4 border-amber-600",
        glow: "",
      };
    default:
      return {
        bg: "bg-card hover:bg-muted/50",
        border: "border-l-4 border-border",
        glow: "",
      };
  }
};

const LeaderboardSection = () => {
  const { data: winners, isLoading } = usePublicWinners();

  const now = new Date();
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const displayedWinners = winners?.slice(0, 5) || [];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream/30 via-background to-cream/20" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-6"
          >
            <Trophy className="w-8 h-8 text-primary" />
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Our Lucky{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">
                Winners
              </span>
              <Sparkles className="absolute -top-2 -right-6 w-5 h-5 text-yellow-500 animate-pulse" />
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8">
            Congratulations to our amazing winners! Your next win could be just one code away.
          </p>
          <Badge 
            variant="outline" 
            className="px-4 py-2 text-sm font-medium border-2 border-primary/30 bg-primary/5 text-primary"
          >
            <Star className="w-4 h-4 mr-2 fill-primary/30" />
            {format(previousMonth, "MMMM yyyy")} Draw Results
          </Badge>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border/50 shadow-2xl shadow-primary/5 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 px-6 py-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">Recent Winners</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {displayedWinners.length} winner{displayedWinners.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {isLoading ? (
              <div className="p-12 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4"
                >
                  <Trophy className="w-6 h-6 text-primary" />
                </motion.div>
                <p className="text-muted-foreground">Loading winners...</p>
              </div>
            ) : displayedWinners.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Gift className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">No winners announced yet</p>
                <p className="text-sm text-muted-foreground mt-1">Be the first to win!</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {displayedWinners.map((winner, index) => {
                  const styles = getRankStyles(index);
                  return (
                    <motion.div
                      key={winner.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08 }}
                      whileHover={{ x: 4 }}
                      className={`flex items-center justify-between p-5 ${styles.bg} ${styles.border} ${styles.glow} transition-all duration-300`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank Badge */}
                        <div className={`
                          w-10 h-10 rounded-xl flex items-center justify-center
                          ${index === 0 ? "bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/30" : 
                            index === 1 ? "bg-gradient-to-br from-slate-300 to-slate-400" :
                            index === 2 ? "bg-gradient-to-br from-amber-500 to-amber-600" :
                            "bg-muted"}
                        `}>
                          {index < 3 ? (
                            <span className="text-sm font-bold text-white">#{index + 1}</span>
                          ) : (
                            getRankIcon(index)
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-foreground">
                              {winner.profiles?.full_name || "Lucky Winner"}
                            </p>
                            {index === 0 && (
                              <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                👑
                              </motion.span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <span>🗓</span>
                            {format(new Date(winner.created_at), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      
                      <Badge
                        className={`
                          px-3 py-1.5 font-medium
                          ${index === 0 ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-lg shadow-yellow-500/20" :
                            index === 1 ? "bg-slate-400 text-white border-0" :
                            index === 2 ? "bg-amber-600 text-white border-0" :
                            "bg-secondary text-secondary-foreground"}
                        `}
                      >
                        🎁 {winner.prizes?.name || "Prize"}
                      </Badge>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-10"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Enter your code today for a chance to be our next winner!
              </span>
              <Sparkles className="w-4 h-4 text-secondary" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default LeaderboardSection;