import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const HeroSection = () => {
  return <section className="relative min-h-[80vh] flex items-center overflow-hidden pt-20 bg-gradient-to-b from-cream to-background">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      <div className="container relative z-10 px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.1
          }}>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold leading-tight mb-2">
                <span className="text-primary">Snack.</span>{" "}
                <span className="text-secondary">Scan.</span>{" "}
                <span className="text-green-500">Win!</span>
              </h1>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
                The Shareat Lucky Draw Party
              </h2>
            </motion.div>

            <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.2
          }} className="text-lg text-muted-foreground mb-8 max-w-lg">
              Turn every crispy snack into REWARDS! Collect Shareat points, unlock prizes, 
              and unlock exclusive deals, vouchers, and sweepstakes.
            </motion.p>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.3
          }} className="flex flex-wrap gap-4 mb-12">
              <Link to="/enter">
                <Button variant="hero" size="xl" className="gap-2">
                  Start Earning Points
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="xl" className="gap-2">
                  <Users className="w-5 h-5" />
                  View My Points
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            
          </div>

          {/* Right Image */}
          <motion.div initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: 0.3
        }} className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-green-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-cream to-background rounded-3xl p-8 border border-border/50 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/10 rounded-2xl p-6 flex items-center justify-center">
                    <span className="text-6xl">🍿</span>
                  </div>
                  <div className="bg-secondary/10 rounded-2xl p-6 flex items-center justify-center">
                    <span className="text-6xl">🎁</span>
                  </div>
                  <div className="bg-green-500/10 rounded-2xl p-6 flex items-center justify-center">
                    <span className="text-6xl">🏆</span>
                  </div>
                  <div className="bg-primary/10 rounded-2xl p-6 flex items-center justify-center">
                    <span className="text-6xl">🎉</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default HeroSection;