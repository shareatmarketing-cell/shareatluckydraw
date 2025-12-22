import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, Gift, Sparkles } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      // Next draw is at the end of the current month (last day at 11:59:59 PM)
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const endOfMonth = new Date(nextYear, nextMonth, 1, 0, 0, 0);
      
      const difference = endOfMonth.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-10 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4"
            >
              <Clock className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary">Next Draw Countdown</span>
              <Sparkles className="w-4 h-4 text-secondary animate-bounce-subtle" />
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              Time Until Next Lucky Draw
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Don't miss your chance! Enter your codes before the monthly draw ends.
            </p>
          </div>

          {/* Countdown Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-lg relative overflow-hidden"
          >
            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-secondary/20 to-transparent rounded-br-3xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-primary/20 to-transparent rounded-tl-3xl" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {timeUnits.map((unit, index) => (
                <motion.div
                  key={unit.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className="bg-gradient-to-br from-muted/50 to-muted rounded-2xl p-4 md:p-6 text-center border border-border/50 transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-lg">
                    <motion.span
                      key={unit.value}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="block text-4xl md:text-6xl font-display font-bold bg-gradient-to-br from-primary to-primary/80 bg-clip-text text-transparent"
                    >
                      {String(unit.value).padStart(2, "0")}
                    </motion.span>
                    <span className="text-sm md:text-base text-muted-foreground font-medium mt-2 block">
                      {unit.label}
                    </span>
                  </div>
                  
                  {/* Separator dots (except after last item) */}
                  {index < 3 && (
                    <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 flex-col gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* CTA below countdown */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-5 h-5 text-accent" />
                <span className="text-sm">Draw happens at the end of every month</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Gift className="w-5 h-5 text-secondary" />
                <span className="text-sm">Amazing prizes await!</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CountdownTimer;
