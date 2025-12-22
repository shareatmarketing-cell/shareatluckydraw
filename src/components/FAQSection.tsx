import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I find and redeem codes from snack packs?",
    answer: "Look inside your Shareat snack pack packaging for a unique 12-digit code printed on a special card or the inside of the wrapper. Enter this code on our website or app to earn points instantly!",
  },
  {
    question: "How many points do I get per code?",
    answer: "Each valid unique code gives you 10 points. Collect more snack packs and enter more codes to accumulate points faster and climb the leaderboard!",
  },
  {
    question: "How can I redeem my prizes?",
    answer: "Once you have enough points, visit the Rewards section and choose from available prizes. E-vouchers are sent instantly via email, while physical prizes are delivered within 7-14 business days.",
  },
  {
    question: "What happens if my code doesn't work?",
    answer: "Make sure you're entering the code exactly as printed. If it still doesn't work, the code might already be redeemed or expired. Contact our support team for assistance.",
  },
  {
    question: "What are the Lucky Draw and Monthly Challenge rewards?",
    answer: "The Lucky Draw gives random winners a chance at mega prizes every month. The Monthly Challenge rewards the top 3 point earners with exclusive grand prizes like electronics, vouchers, and more!",
  },
  {
    question: "Can I transfer my points to another account?",
    answer: "Currently, points are non-transferable and tied to your account. However, you can gift redeemed prizes to anyone!",
  },
  {
    question: "How long are my points valid?",
    answer: "Points remain valid for 12 months from the date they were earned. Make sure to redeem them before they expire!",
  },
  {
    question: "Do I need to pay for shipping for prizes/rewards?",
    answer: "Shipping is free for most prizes within India. For select premium rewards, nominal shipping charges may apply as mentioned on the reward details page.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-cream/30">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about the Shareat Lucky Draw
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
