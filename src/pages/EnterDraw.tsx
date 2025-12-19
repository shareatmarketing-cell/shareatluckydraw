import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CodeEntryForm from "@/components/CodeEntryForm";
import { Sparkles } from "lucide-react";

const EnterDraw = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" />
        
        <div className="container max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 mb-4">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary-foreground">December 2024 Draw</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
              Enter the Lucky Draw
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Enter the unique code from your Shareat snack pack for a chance to win amazing prizes!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CodeEntryForm />
          </motion.div>

          {/* Tips section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 p-6 rounded-2xl bg-cream border border-border/50"
          >
            <h3 className="font-display font-bold text-lg text-foreground mb-4 text-center">
              💡 Tips for Finding Your Code
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div className="text-center p-4">
                <div className="font-semibold text-foreground mb-1">Look Inside</div>
                The code is printed on the inside of the packaging
              </div>
              <div className="text-center p-4">
                <div className="font-semibold text-foreground mb-1">12 Characters</div>
                Each code is 12 characters long (letters and numbers)
              </div>
              <div className="text-center p-4">
                <div className="font-semibold text-foreground mb-1">One Per Pack</div>
                Each Shareat snack pack contains one unique code
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EnterDraw;
