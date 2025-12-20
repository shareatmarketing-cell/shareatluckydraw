import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I find codes from snack packs?",
    answer: "Look inside your Shareat snack pack packaging for a unique 12-digit code printed on a special card or wrapper.",
  },
  {
    question: "How many points do I get per code?",
    answer: "Each valid unique code gives you 10 points. Enter more codes to accumulate points faster!",
  },
  {
    question: "How can I redeem my prizes?",
    answer: "Visit the Rewards section and choose from available prizes. E-vouchers are sent instantly, physical prizes are delivered within 7-14 days.",
  },
  {
    question: "What if my code doesn't work?",
    answer: "Make sure you're entering the code exactly as printed. If it still doesn't work, the code might be redeemed or expired.",
  },
  {
    question: "How long are my points valid?",
    answer: "Points remain valid for 12 months from the date they were earned.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-24 bg-cream/30">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Questions & Answers
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border px-5 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
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
