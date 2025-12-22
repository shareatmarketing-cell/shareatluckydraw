import { motion } from "framer-motion";
import { Gift, Ticket, Sparkles, Trophy, Star, Crown, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const rewards = [
  {
    icon: Gift,
    title: "Gift Rewards",
    description: "Win exclusive product hampers, merchandise, and surprise gift boxes!",
    gradient: "from-primary via-primary/80 to-primary/60",
    bgGlow: "bg-primary/20",
    shadowColor: "hover:shadow-primary/20",
    tag: "Popular",
  },
  {
    icon: Ticket,
    title: "E-Vouchers & Discounts",
    description: "Get instant discount codes for your favorite stores and restaurants!",
    gradient: "from-secondary via-secondary/80 to-secondary/60",
    bgGlow: "bg-secondary/20",
    shadowColor: "hover:shadow-secondary/20",
    tag: "Instant",
  },
  {
    icon: Sparkles,
    title: "Surprise Gifts",
    description: "Lucky members get exclusive surprise gifts delivered to their doorstep!",
    gradient: "from-accent via-accent/80 to-accent/60",
    bgGlow: "bg-accent/20",
    shadowColor: "hover:shadow-accent/20",
    tag: "Exclusive",
  },
];

const floatingPrizes = [
  { emoji: "🎁", position: "top-8 left-8", delay: 0, size: "text-4xl" },
  { emoji: "🏆", position: "top-16 right-12", delay: 0.5, size: "text-5xl" },
  { emoji: "💎", position: "bottom-20 left-16", delay: 1, size: "text-3xl" },
  { emoji: "🎉", position: "bottom-12 right-8", delay: 1.5, size: "text-4xl" },
  { emoji: "⭐", position: "top-1/2 left-4", delay: 2, size: "text-3xl" },
];

const FeaturedRewards = () => {
  return (
    <section id="rewards" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream/30 via-background to-cream/30" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Badge */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full mb-6"
              >
                <Trophy className="w-5 h-5 text-secondary" />
                <span className="text-sm font-semibold text-secondary">Premium Rewards</span>
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-display font-bold mb-5">
                Amazing{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Rewards & Benefits
                  </span>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full origin-left"
                  />
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-lg">
                Every code brings you closer to amazing rewards and exclusive VIP benefits—enjoy the 
                perks of being a Shareat member!
              </p>
            </motion.div>

            {/* Reward Cards */}
            <div className="space-y-5">
              {rewards.map((reward, index) => {
                const Icon = reward.icon;
                return (
                  <motion.div
                    key={reward.title}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15, duration: 0.5 }}
                    whileHover={{ x: 8 }}
                    className="group"
                  >
                    <div className={`relative bg-card border border-border/50 rounded-2xl p-5 overflow-hidden transition-all duration-300 group-hover:border-border group-hover:shadow-xl ${reward.shadowColor}`}>
                      {/* Background glow on hover */}
                      <div className={`absolute inset-0 ${reward.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
                      
                      <div className="relative flex items-center gap-5">
                        {/* Icon */}
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className={`w-16 h-16 bg-gradient-to-br ${reward.gradient} rounded-2xl flex items-center justify-center shrink-0 shadow-lg`}
                        >
                          <Icon className="w-8 h-8 text-primary-foreground" />
                        </motion.div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-display font-bold text-lg text-foreground">{reward.title}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gradient-to-r ${reward.gradient} text-primary-foreground`}>
                              {reward.tag}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{reward.description}</p>
                        </div>

                        {/* Arrow */}
                        <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-muted/50 group-hover:bg-muted transition-colors">
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex items-center gap-4"
            >
              <Link to="/rewards">
                <Button variant="hero" size="lg" className="group">
                  <span>View All Rewards</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="w-4 h-4 text-secondary" />
                <span className="text-sm">New prizes every month</span>
              </div>
            </motion.div>
          </div>

          {/* Right - Prize Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Animated background rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 border-2 border-dashed border-primary/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-16 border-2 border-dashed border-secondary/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-24 border-2 border-dashed border-accent/20 rounded-full"
              />

              {/* Floating prize emojis */}
              {floatingPrizes.map((prize, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: prize.delay, type: "spring" }}
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  style={{ animationDelay: `${prize.delay}s` }}
                  className={`absolute ${prize.position} ${prize.size}`}
                >
                  <motion.span
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3 + index * 0.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {prize.emoji}
                  </motion.span>
                </motion.div>
              ))}

              {/* Center showcase card */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 rounded-3xl blur-2xl scale-110" />
                  <div className="relative bg-card border border-border/50 rounded-3xl p-10 shadow-2xl overflow-hidden">
                    {/* Decorative corners */}
                    <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent rounded-br-3xl" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-secondary/20 to-transparent rounded-tl-3xl" />
                    
                    <div className="flex flex-col items-center text-center">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="mb-4"
                      >
                        <Crown className="w-16 h-16 text-secondary drop-shadow-lg" />
                      </motion.div>
                      
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-secondary fill-secondary" />
                        ))}
                      </div>
                      
                      <h3 className="text-2xl font-display font-bold mb-2 text-foreground">
                        Grand Prize
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Win up to ₹1 Lakh worth of prizes!
                      </p>
                      
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary rounded-full">
                        <Sparkles className="w-4 h-4 text-primary-foreground" />
                        <span className="text-sm font-semibold text-primary-foreground">Monthly Draw</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRewards;
