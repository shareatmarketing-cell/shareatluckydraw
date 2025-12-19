import { motion } from "framer-motion";
import { Heart, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">S</span>
              </div>
              <span className="font-display font-bold text-xl">Shareat Foods</span>
            </div>
            <p className="text-background/70 text-sm">
              Delicious, hygienic snacks that bring joy to every bite. 
              Join our monthly lucky draw and win amazing prizes!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="/" className="hover:text-secondary transition-colors">Home</a></li>
              <li><a href="/winners" className="hover:text-secondary transition-colors">Winners</a></li>
              <li><a href="/enter" className="hover:text-secondary transition-colors">Enter Draw</a></li>
              <li><a href="/auth" className="hover:text-secondary transition-colors">Login</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Connect With Us</h4>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-background/10 hover:bg-secondary hover:text-secondary-foreground flex items-center justify-center transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
            <p className="mt-4 text-sm text-background/70">
              support@shareatfoods.com
            </p>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 text-center text-sm text-background/50">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-primary fill-primary" /> by Shareat Foods
          </p>
          <p className="mt-2">© 2024 Shareat Foods. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
