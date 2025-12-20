import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const leaderboard = [
  { rank: 1, name: "Priya K.", location: "Mumbai", points: 4847 },
  { rank: 2, name: "Rahul S.", location: "Delhi", points: 4235 },
  { rank: 3, name: "Ananya R.", location: "Bangalore", points: 3998 },
  { rank: 4, name: "Vikram T.", location: "Chennai", points: 3756 },
  { rank: 5, name: "Meera J.", location: "Pune", points: 3542 },
  { rank: 6, name: "Arjun M.", location: "Hyderabad", points: 3298 },
  { rank: 7, name: "Sneha P.", location: "Kolkata", points: 3156 },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-5 h-5 text-yellow-500" />;
    case 2:
      return <Medal className="w-5 h-5 text-slate-400" />;
    case 3:
      return <Award className="w-5 h-5 text-amber-600" />;
    default:
      return <span className="text-muted-foreground font-bold">{rank}</span>;
  }
};

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border-yellow-500/30";
    case 2:
      return "bg-gradient-to-r from-slate-400/20 to-slate-400/5 border-slate-400/30";
    case 3:
      return "bg-gradient-to-r from-amber-600/20 to-amber-600/5 border-amber-600/30";
    default:
      return "bg-card border-border/50";
  }
};

const LeaderboardSection = () => {
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
            The Shareat{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Monthly Challenge
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Race to the top! The top 3 members with the most points at month's end win exclusive mega prizes!
          </p>
          <Badge variant="outline" className="text-primary border-primary">
            🏆 Challenge ends in: December 2024
          </Badge>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
            <div className="divide-y divide-border">
              {leaderboard.map((user, index) => (
                <motion.div
                  key={user.rank}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center justify-between p-4 ${getRankColor(user.rank)} border-l-4`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center">
                      {getRankIcon(user.rank)}
                    </div>
                    <div>
                      <p className="font-bold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.location}</p>
                    </div>
                  </div>
                  <Badge
                    variant={user.rank <= 3 ? "default" : "secondary"}
                    className={user.rank === 1 ? "bg-yellow-500 text-yellow-950" : user.rank === 2 ? "bg-slate-400 text-slate-950" : user.rank === 3 ? "bg-amber-600 text-amber-950" : ""}
                  >
                    {user.points.toLocaleString()} pts
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-muted-foreground mt-6"
          >
            *Top 100 members will receive consolation prizes. <Link to="/winners" className="text-primary hover:underline">See past winners</Link>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default LeaderboardSection;
