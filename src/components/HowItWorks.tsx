import { motion } from "framer-motion";
import { Gift, QrCode, Trophy, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Gift,
    title: "Buy Shareat Snacks",
    description: "Purchase any Shareat product from your nearest store",
    color: "from-primary to-primary-glow",
    shadowColor: "shadow-glow-primary",
  },
  {
    icon: QrCode,
    title: "Find Your Code",
    description: "Look for the unique code printed inside the packaging",
    color: "from-secondary to-gold",
    shadowColor: "shadow-glow-secondary",
  },
  {
    icon: Sparkles,
    title: "Enter the Draw",
    description: "Login and submit your code to enter the monthly draw",
    color: "from-accent to-accent-glow",
    shadowColor: "shadow-glow-success",
  },
  {
    icon: Trophy,
    title: "Win Prizes!",
    description: "Winners are announced at the end of each month",
    color: "from-secondary to-gold",
    shadowColor: "shadow-glow-secondary",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Participating in our lucky draw is super easy. Follow these simple steps!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-border to-transparent" />
              )}
              
              <div className="group text-center p-6 rounded-3xl bg-card border border-border/50 hover:shadow-elevated transition-all duration-300 hover:-translate-y-2">
                {/* Step number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-card border-2 border-primary flex items-center justify-center font-display font-bold text-primary text-sm">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center ${step.shadowColor}`}
                >
                  <step.icon className="w-10 h-10 text-primary-foreground" />
                </motion.div>
                
                <h3 className="font-display font-bold text-xl text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
