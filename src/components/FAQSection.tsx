import { motion } from "framer-motion";
import { HelpCircle, Sparkles, Calendar, Ticket, Trophy, Gift, Clock, Users } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LucideIcon } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
  icon: LucideIcon;
}

const faqs: FAQ[] = [
  {
    question: "What is the Shareat Lucky Draw?",
    answer: "The Shareat Lucky Draw is a monthly contest where you can win amazing prizes just by entering unique codes found inside Shareat snack packs. Every code you enter gives you an entry into that month's lucky draw!",
    icon: Ticket,
  },
  {
    question: "How do I enter the Lucky Draw?",
    answer: "Simply find the unique 12-digit code inside your Shareat snack pack, create an account or log in, and enter the code. Each valid code automatically enters you into the current month's lucky draw.",
    icon: Gift,
  },
  {
    question: "When does the Lucky Draw happen?",
    answer: "The Lucky Draw takes place at the end of every month. Winners are randomly selected from all valid entries received during that month and announced on the 1st of the following month.",
    icon: Calendar,
  },
  {
    question: "What prizes can I win?",
    answer: "Prizes vary each month and include exciting rewards like smartphones (iPhone, Samsung), gaming consoles (PS5, Xbox), shopping vouchers (Amazon, Flipkart), and exclusive Shareat merchandise!",
    icon: Trophy,
  },
  {
    question: "How are winners selected?",
    answer: "Winners are selected through a completely random and transparent computerized draw. Each code entry gives you one chance to win. The more codes you enter, the higher your chances!",
    icon: Users,
  },
  {
    question: "How will I know if I've won?",
    answer: "Winners are notified via email and SMS within 24 hours of the draw. You can also check the Winners section on our website. Make sure your contact details are up to date in your profile!",
    icon: Sparkles,
  },
  {
    question: "Is there a limit to how many codes I can enter?",
    answer: "There's no limit! You can enter as many valid codes as you have. Each code gives you an additional entry, increasing your chances of winning the Lucky Draw.",
    icon: Ticket,
  },
  {
    question: "How long do I have to claim my prize?",
    answer: "Winners must claim their prizes within 30 days of the announcement. E-vouchers are sent instantly via email, while physical prizes are delivered within 7-14 business days after verification.",
    icon: Clock,
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-cream/20 to-background" />
      <div className="absolute top-10 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full mb-4"
          >
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary">Got Questions?</span>
          </motion.div>

          <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
            Lucky Draw{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                FAQ
              </span>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-full origin-left"
              />
            </span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Everything you need to know about winning amazing prizes with Shareat
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, index) => {
              const Icon = faq.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="group bg-card border border-border/50 rounded-xl px-4 overflow-hidden data-[state=open]:border-primary/30 data-[state=open]:shadow-md data-[state=open]:shadow-primary/5 transition-all duration-300"
                  >
                    <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-3 gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0 group-data-[state=open]:from-primary group-data-[state=open]:to-primary/80 transition-all duration-300">
                          <Icon className="w-4 h-4 text-primary group-data-[state=open]:text-primary-foreground transition-colors duration-300" />
                        </div>
                        <span className="text-foreground group-hover:text-primary transition-colors">
                          {faq.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground pb-3 pl-11">
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {faq.answer}
                      </motion.div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              );
            })}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
