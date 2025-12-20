import { motion } from "framer-motion";
import { Crown, Star, Award, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const tiers = [
  {
    name: "Snack Starter",
    subtitle: "Bronze",
    icon: Star,
    color: "from-amber-600/20 to-amber-600/5",
    borderColor: "border-amber-600/30",
    iconBg: "bg-amber-600/20",
    iconColor: "text-amber-600",
    points: "0 - 499",
    benefits: [
      "Basic reward access",
      "Monthly newsletter",
      "5% off on select items",
    ],
  },
  {
    name: "Snack Champion",
    subtitle: "Gold",
    icon: Crown,
    color: "from-secondary/30 to-secondary/10",
    borderColor: "border-secondary",
    iconBg: "bg-secondary/30",
    iconColor: "text-secondary",
    points: "500 - 1,499",
    featured: true,
    benefits: [
      "All Bronze benefits",
      "Early bird access to promos",
      "Birthday special rewards",
      "Exclusive member-only offers",
      "Priority support",
    ],
  },
  {
    name: "Snack Master",
    subtitle: "Platinum",
    icon: Award,
    color: "from-slate-400/20 to-slate-400/5",
    borderColor: "border-slate-400/30",
    iconBg: "bg-slate-400/20",
    iconColor: "text-slate-500",
    points: "1,500+",
    benefits: [
      "All Gold benefits",
      "Double points weekends",
      "Free shipping on orders",
      "VIP event invitations",
    ],
  },
];

const TiersSection = () => {
  return (
    <section className="py-20 bg-cream/30">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            ⭐ Earn & Level Up
          </Badge>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Advance Through{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Exclusive Tiers
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Collect more points and unlock bigger rewards, exclusive perks, and VIP access!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier, index) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${tier.featured ? "md:-mt-4 md:mb-4" : ""}`}
              >
                <div
                  className={`h-full bg-gradient-to-b ${tier.color} rounded-2xl p-6 border-2 ${tier.borderColor} ${
                    tier.featured ? "shadow-xl" : "hover:shadow-lg"
                  } transition-shadow`}
                >
                  {tier.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-secondary text-secondary-foreground">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 ${tier.iconBg} rounded-full flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 ${tier.iconColor}`} />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-display font-bold">{tier.name}</h3>
                    <p className="text-sm text-muted-foreground">{tier.subtitle}</p>
                    <p className="text-lg font-bold text-primary mt-2">{tier.points} pts</p>
                  </div>

                  {/* Benefits */}
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TiersSection;
