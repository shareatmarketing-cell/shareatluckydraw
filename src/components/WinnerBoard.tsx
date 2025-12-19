import { motion } from "framer-motion";
import { Trophy, MapPin, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { pastWinners } from "@/lib/mockData";

const WinnerBoard = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-cream relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-cream/50" />
      
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 mb-4">
            <Trophy className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary-foreground">Winner Board</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            Our Lucky Winners
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Congratulations to all our previous winners! Your name could be next on this board.
          </p>
        </motion.div>

        <div className="grid gap-4 max-w-4xl mx-auto">
          {pastWinners.map((winner, index) => (
            <motion.div
              key={winner.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 p-4 md:p-6">
                    {/* Rank/Position */}
                    <div className={`flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center font-display font-bold text-lg md:text-xl ${
                      index === 0 
                        ? 'bg-gradient-to-br from-secondary to-gold text-secondary-foreground shadow-glow-secondary' 
                        : index === 1 
                          ? 'bg-gradient-to-br from-primary to-primary-glow text-primary-foreground' 
                          : 'bg-accent text-accent-foreground'
                    }`}>
                      {index === 0 ? '🏆' : `#${index + 1}`}
                    </div>

                    {/* Winner Info */}
                    <div className="flex-grow min-w-0">
                      <h3 className="font-display font-bold text-lg md:text-xl text-foreground truncate">
                        {winner.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {winner.city}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {winner.month} {winner.year}
                        </span>
                      </div>
                    </div>

                    {/* Prize */}
                    <div className="flex-shrink-0 text-right">
                      <span className="inline-block px-4 py-2 rounded-xl bg-cream text-foreground font-semibold text-sm md:text-base border border-border/50">
                        {winner.prize}
                      </span>
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
      </div>
    </section>
  );
};

export default WinnerBoard;
