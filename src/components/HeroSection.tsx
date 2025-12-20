import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-24 pb-12 bg-gradient-to-br from-cream via-background to-cream/50">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/15 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

      <div className="container relative z-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-secondary/15 text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium mb-8 border border-secondary/20"
          >
            <Sparkles className="w-4 h-4 text-secondary" />
            Monthly Lucky Draw is LIVE!
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.1] mb-6">
              <span className="text-primary">Snack.</span>{" "}
              <span className="text-secondary">Scan.</span>{" "}
              <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">Win!</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Turn every crispy Shareat snack into rewards! Enter codes, collect points, 
            and win exclusive prizes, vouchers, and more.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/auth">
              <Button variant="hero" size="xl" className="gap-2 shadow-lg shadow-primary/25">
                Start Earning Points
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="xl" className="gap-2 bg-background/50 backdrop-blur-sm">
                Sign In
              </Button>
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-8 md:gap-12 mt-16 pt-8 border-t border-border/50"
          >
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-display font-bold text-primary">12</p>
              <p className="text-sm text-muted-foreground">Monthly Draws</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-display font-bold text-secondary">45+</p>
              <p className="text-sm text-muted-foreground">Prizes/Month</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-display font-bold text-green-500">₹50K</p>
              <p className="text-sm text-muted-foreground">Prize Value</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;