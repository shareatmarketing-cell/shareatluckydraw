import { motion } from "framer-motion";
import { Gift, Ticket, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const rewards = [
  {
    icon: Gift,
    title: "Gift Rewards",
    description: "Win exclusive product hampers, merchandise, and surprise gift boxes!",
    color: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
  },
  {
    icon: Ticket,
    title: "E-Vouchers & Discounts",
    description: "Get instant discount codes for your favorite stores and restaurants!",
    color: "from-secondary/20 to-secondary/5",
    iconBg: "bg-secondary/20",
    iconColor: "text-secondary",
  },
  {
    icon: Sparkles,
    title: "Surprise Gifts",
    description: "Lucky members get exclusive surprise gifts delivered to their doorstep!",
    color: "from-green-500/20 to-green-500/5",
    iconBg: "bg-green-500/20",
    iconColor: "text-green-500",
  },
];

const FeaturedRewards = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-cream/50 to-background">
      <div className="container px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Amazing{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Rewards & Benefits
                </span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Every point brings you closer to amazing rewards and exclusive VIP benefits—enjoy the 
                perks of being a Shareat member!
              </p>
            </motion.div>

            <div className="space-y-4">
              {rewards.map((reward, index) => {
                const Icon = reward.icon;
                return (
                  <motion.div
                    key={reward.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`bg-gradient-to-r ${reward.color} rounded-xl p-4 border border-border/50 hover:shadow-md transition-shadow`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 ${reward.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                          <Icon className={`w-6 h-6 ${reward.iconColor}`} />
                        </div>
                        <div>
                          <h3 className="font-display font-bold mb-1">{reward.title}</h3>
                          <p className="text-sm text-muted-foreground">{reward.description}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <Link to="/rewards">
                <Button variant="hero" size="lg">
                  View All Rewards
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-green-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-cream to-background rounded-3xl p-8 border border-border/50 shadow-xl overflow-hidden">
                <div className="absolute top-4 right-4 text-6xl opacity-20">🍿</div>
                <div className="absolute bottom-4 left-4 text-6xl opacity-20">🎁</div>
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <span className="text-8xl mb-4">🏆</span>
                  <h3 className="text-2xl font-display font-bold mb-2">Indian Street Food</h3>
                  <p className="text-muted-foreground">Authentic flavors, amazing rewards!</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRewards;
