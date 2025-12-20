import { motion } from "framer-motion";
import { UserPlus, Search, QrCode } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: UserPlus,
    title: "Create Account",
    description: "Sign up with email and join instantly",
    iconBg: "bg-primary",
    iconColor: "text-primary-foreground",
  },
  {
    number: "2",
    icon: Search,
    title: "Find Your Code",
    description: "Look inside every Shareat snack pack",
    iconBg: "bg-secondary",
    iconColor: "text-secondary-foreground",
  },
  {
    number: "3",
    icon: QrCode,
    title: "Enter & Win",
    description: "Submit your code to join the draw",
    iconBg: "bg-green-500",
    iconColor: "text-white",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Three simple steps to start winning amazing prizes
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center"
              >
                {/* Icon with number */}
                <div className="relative inline-flex mb-6">
                  <div className={`w-20 h-20 ${step.iconBg} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <Icon className={`w-10 h-10 ${step.iconColor}`} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-display font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
