import { motion } from "framer-motion";
import { UserPlus, Search, QrCode, Gift, ArrowRight, Sparkles, CheckCircle2, PartyPopper } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Account",
    description: "Sign up using mobile or email and join the Shareat Party instantly",
    highlight: "Quick & Easy",
    gradient: "from-primary via-primary/80 to-primary/60",
    glowColor: "shadow-primary/30",
    bgPattern: "radial-gradient(circle at 80% 20%, hsl(var(--primary) / 0.15) 0%, transparent 50%)",
  },
  {
    number: "02",
    icon: Search,
    title: "Find the Secret Code",
    description: "Look for the code hidden inside every Shareat Snack Pack product",
    highlight: "In Every Pack",
    gradient: "from-secondary via-secondary/80 to-secondary/60",
    glowColor: "shadow-secondary/30",
    bgPattern: "radial-gradient(circle at 20% 80%, hsl(var(--secondary) / 0.15) 0%, transparent 50%)",
  },
  {
    number: "03",
    icon: QrCode,
    title: "Enter Your Code",
    description: "Submit your secret 12-digit code and enter the monthly lucky draw",
    highlight: "Win Big!",
    gradient: "from-accent via-accent/80 to-accent/60",
    glowColor: "shadow-accent/30",
    bgPattern: "radial-gradient(circle at 80% 80%, hsl(var(--accent) / 0.15) 0%, transparent 50%)",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-cream/30 to-background" />
      <div className="absolute top-20 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      {/* Floating elements */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 right-[15%] hidden lg:block"
      >
        <Gift className="w-12 h-12 text-secondary/30" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-40 left-[10%] hidden lg:block"
      >
        <Sparkles className="w-10 h-10 text-primary/30" />
      </motion.div>

      <div className="container px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-6"
          >
            <CheckCircle2 className="w-5 h-5 text-accent" />
            <span className="text-sm font-semibold text-accent">Simple Process</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-5">
            Enter the Lucky Draw in{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                3 Easy Steps!
              </span>
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
              />
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            It's simple, fun, and rewarding! Stop snacking without rewards today.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="relative group"
              >
                {/* Connection line (hidden on mobile, shown between cards) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 z-20">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.2 }}
                      viewport={{ once: true }}
                    >
                      <ArrowRight className="w-6 h-6 text-muted-foreground/40" />
                    </motion.div>
                  </div>
                )}

                {/* Card */}
                <div 
                  className="h-full bg-card border border-border/50 rounded-3xl p-8 relative overflow-hidden transition-all duration-500 group-hover:border-border group-hover:shadow-xl"
                  style={{ background: step.bgPattern }}
                >
                  {/* Hover glow effect */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${step.gradient} blur-3xl scale-150`} style={{ opacity: 0.05 }} />
                  
                  {/* Step number */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className={`absolute -top-1 -right-1 w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center font-display font-bold text-xl text-primary-foreground shadow-lg ${step.glowColor}`}
                  >
                    {step.number}
                  </motion.div>

                  {/* Icon container */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg ${step.glowColor} group-hover:shadow-xl transition-shadow duration-300`}
                  >
                    <Icon className="w-10 h-10 text-primary-foreground" />
                  </motion.div>

                  {/* Highlight badge */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${step.gradient} text-primary-foreground text-xs font-semibold mb-4`}>
                    <Sparkles className="w-3 h-3" />
                    {step.highlight}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-display font-bold mb-3 text-foreground group-hover:text-foreground transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  {/* Bottom decoration */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-card border border-border/50 rounded-full px-6 py-3 shadow-lg">
            <PartyPopper className="w-5 h-5 text-secondary animate-bounce-subtle" />
            <span className="text-muted-foreground">
              That's it! You're now in the draw for amazing prizes
            </span>
            <Gift className="w-5 h-5 text-primary animate-pulse" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
