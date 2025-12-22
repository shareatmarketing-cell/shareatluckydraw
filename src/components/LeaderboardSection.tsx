import { motion } from "framer-motion";
import { Trophy, Medal, Award, Gift } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePublicWinners } from "@/hooks/useDrawData";
import { format } from "date-fns";

const getRankIcon = (index: number) => {
  switch (index) {
    case 0:
      return <Trophy className="w-5 h-5 text-yellow-500" />;
    case 1:
      return <Medal className="w-5 h-5 text-slate-400" />;
    case 2:
      return <Award className="w-5 h-5 text-amber-600" />;
    default:
      return <Gift className="w-5 h-5 text-primary" />;
  }
};

const getRankColor = (index: number) => {
  switch (index) {
    case 0:
      return "bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border-yellow-500/30";
    case 1:
      return "bg-gradient-to-r from-slate-400/20 to-slate-400/5 border-slate-400/30";
    case 2:
      return "bg-gradient-to-r from-amber-600/20 to-amber-600/5 border-amber-600/30";
    default:
      return "bg-card border-border/50";
  }
};

const LeaderboardSection = () => {
  const { data: winners, isLoading } = usePublicWinners();

  // Show all recent winners (not filtering by previous month since winners may have various dates)
  const now = new Date();
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Simply display all public winners - the filtering was too strict
  const displayedWinners = winners?.slice(0, 5) || [];

  return (
    <section className="py-20 bg-cream/30">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Previous Month{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Winners
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Congratulations to our lucky winners from {format(previousMonth, "MMMM yyyy")}!
          </p>
          <Badge variant="outline" className="text-primary border-primary">
            🎉 {format(previousMonth, "MMMM yyyy")} Draw Results
          </Badge>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading winners...
              </div>
            ) : displayedWinners.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No winners announced yet
              </div>
            ) : (
              <div className="divide-y divide-border">
                {displayedWinners.map((winner, index) => (
                  <motion.div
                    key={winner.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-4 ${getRankColor(index)} border-l-4`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 flex items-center justify-center">
                        {getRankIcon(index)}
                      </div>
                      <div>
                        <p className="font-bold">
                          {winner.profiles?.full_name || "Lucky Winner"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Won on {format(new Date(winner.created_at), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={index <= 2 ? "default" : "secondary"}
                      className={
                        index === 0
                          ? "bg-yellow-500 text-yellow-950"
                          : index === 1
                          ? "bg-slate-400 text-slate-950"
                          : index === 2
                          ? "bg-amber-600 text-amber-950"
                          : ""
                      }
                    >
                      {winner.prizes?.name || "Prize"}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-muted-foreground mt-6"
          >
            Enter your code today for a chance to win next month!
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default LeaderboardSection;