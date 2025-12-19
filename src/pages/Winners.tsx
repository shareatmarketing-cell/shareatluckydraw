import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trophy, MapPin, Calendar, Gift } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { pastWinners } from "@/lib/mockData";

const Winners = () => {
  const groupedByMonth = pastWinners.reduce((acc, winner) => {
    const key = `${winner.month} ${winner.year}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(winner);
    return acc;
  }, {} as Record<string, typeof pastWinners>);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 mb-4">
              <Trophy className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary-foreground">Hall of Fame</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
              Our Lucky Winners
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Congratulations to all our winners! Your name could be next on this board.
            </p>
          </motion.div>

          {Object.entries(groupedByMonth).map(([monthYear, winners], groupIndex) => (
            <motion.div
              key={monthYear}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="font-display font-bold text-xl text-foreground">{monthYear}</h2>
              </div>
              
              <div className="grid gap-4">
                {winners.map((winner, index) => (
                  <motion.div
                    key={winner.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: groupIndex * 0.1 + index * 0.05 }}
                  >
                    <Card className="group hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-4 p-4 md:p-6">
                          {/* Rank/Position */}
                          <div className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center font-display font-bold text-lg ${
                            index === 0 
                              ? 'bg-gradient-to-br from-secondary to-gold text-secondary-foreground shadow-glow-secondary' 
                              : index === 1 
                                ? 'bg-gradient-to-br from-primary to-primary-glow text-primary-foreground' 
                                : 'bg-accent text-accent-foreground'
                          }`}>
                            {index === 0 ? '🏆' : index === 1 ? '🥈' : '🥉'}
                          </div>

                          {/* Winner Info */}
                          <div className="flex-grow min-w-0">
                            <h3 className="font-display font-bold text-lg text-foreground truncate">
                              {winner.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {winner.city}
                            </div>
                          </div>

                          {/* Prize */}
                          <div className="flex-shrink-0 text-right">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cream border border-border/50">
                              <Gift className="w-4 h-4 text-primary" />
                              <span className="font-semibold text-sm text-foreground">
                                {winner.prize}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Decorative gradient bar */}
                        <div className={`h-1 ${
                          index === 0 
                            ? 'bg-gradient-to-r from-secondary via-gold to-secondary' 
                            : index === 1 
                              ? 'bg-gradient-to-r from-primary via-primary-glow to-primary' 
                              : 'bg-gradient-to-r from-accent via-accent-glow to-accent'
                        }`} />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Winners;
