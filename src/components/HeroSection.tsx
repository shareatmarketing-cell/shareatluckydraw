import { motion } from "framer-motion";
import { Gift, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { currentRewards } from "@/lib/mockData";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-cream to-background" />
      
      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl" />

      <div className="container relative z-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 mb-6"
          >
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary-foreground">December 2024 Lucky Draw</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight"
          >
            <span className="text-foreground">Win Amazing</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
              Prizes Every Month!
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Find the unique code inside your Shareat snack pack and enter it for a chance to win
            incredible prizes. It's that simple!
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link to="/enter">
              <Button variant="hero" size="xl" className="gap-2 min-w-[200px]">
                <Gift className="w-5 h-5" />
                Enter Code Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/winners">
              <Button variant="outline" size="lg">
                View Past Winners
              </Button>
            </Link>
          </motion.div>

          {/* Current Rewards Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider font-medium">
              This Month's Prizes
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {currentRewards.map((reward, index) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group relative bg-card rounded-2xl p-4 border border-border/50 shadow-card hover:shadow-elevated transition-all duration-300"
                >
                  <div className="absolute -top-2 -right-2 z-10">
                    {reward.tier === 'grand' && (
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-gold text-secondary-foreground text-xs font-bold shadow-glow-secondary">
                        🏆
                      </span>
                    )}
                    {reward.tier === 'first' && (
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-xs font-bold">
                        1st
                      </span>
                    )}
                    {reward.tier === 'second' && (
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground text-xs font-bold">
                        2nd
                      </span>
                    )}
                  </div>
                  <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-muted">
                    <img
                      src={reward.imageUrl}
                      alt={reward.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-display font-bold text-sm text-foreground line-clamp-2">
                    {reward.title}
                  </h3>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
