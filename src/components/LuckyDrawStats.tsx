import { motion } from "framer-motion";
import { Instagram, Facebook, Twitter, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  "Quarterly Mega Prizes",
  "Exclusive Jackpot Access",
  "Points for Every Code",
  "No Purchase Limit",
  "Verified Fairness",
  "Instant Notifications",
];

const LuckyDrawStats = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* Social Icons */}
          <div className="flex justify-center gap-4 mb-6">
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>

          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            The Shareat{" "}
            <span className="text-secondary">Lucky Draw System</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Get lucky & claim your wins! The more codes you enter, the more chances you get. It's truly fair and exciting.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12"
        >
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-display font-bold text-primary">12</p>
            <p className="text-sm text-white/60">Monthly Draws</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-display font-bold text-secondary">45</p>
            <p className="text-sm text-white/60">Prizes per Draw</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-display font-bold text-green-400">₹50K</p>
            <p className="text-sm text-white/60">Prize Value Monthly</p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12"
        >
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400 shrink-0" />
              <span className="text-sm text-white/80">{feature}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-white/60 mb-4 text-sm">
            *Next grand prize: Big Claw machine! + Budget laptop, Smart watches, Surprise gifts!
          </p>
          <Link to="/enter">
            <Button variant="hero" size="lg">
              Enter Your Code Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default LuckyDrawStats;
