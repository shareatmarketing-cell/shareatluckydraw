import { motion } from "framer-motion";
import { UserPlus, Search, QrCode, Gift } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: UserPlus,
    title: "Create Your Account",
    description: "Sign up using mobile or email and join the Shareat Party instantly",
    color: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
  },
  {
    number: "2",
    icon: Search,
    title: "Find the Secret Code",
    description: "Look for the code hidden inside every Shareat Snack Pack product",
    color: "from-secondary/20 to-secondary/5",
    iconBg: "bg-secondary/20",
    iconColor: "text-secondary",
  },
  {
    number: "3",
    icon: QrCode,
    title: "Enter Code to Participate in the Lucky Draw",
    description: "Submit your secret 12-digit code and watch points flood into your account",
    color: "from-green-500/20 to-green-500/5",
    iconBg: "bg-green-500/20",
    iconColor: "text-green-500",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-cream/50">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Claim Your Shareat Points in{" "}
            <span className="text-primary">3 Easy Steps!</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            It's simple, fun, and rewarding! Stop snacking without rewards today.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className={`h-full bg-gradient-to-b ${step.color} rounded-2xl p-6 border border-border/50 hover:shadow-lg transition-shadow`}>
                  {/* Step number badge */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-lg">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 ${step.iconBg} rounded-2xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-8 h-8 ${step.iconColor}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-display font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          *1 unique code = 10 Points. Collect your favorite snacks & maximize rewards!
        </motion.p>
      </div>
    </section>
  );
};

export default HowItWorks;
