import { motion } from "framer-motion";
import { Heart, Instagram, Facebook, Twitter, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">S</span>
              </div>
              <span className="font-display font-bold text-xl">Shareat</span>
            </div>
            <p className="text-background/70 text-sm mb-4">
              Delicious, hygienic snacks that bring joy to every bite. 
              Join our monthly lucky draw and win amazing prizes!
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/rewards" className="hover:text-primary transition-colors">Rewards</Link></li>
              <li><Link to="/winners" className="hover:text-primary transition-colors">Winners</Link></li>
              <li><Link to="/enter" className="hover:text-primary transition-colors">Enter Draw</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">About</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-primary transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Products</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Stay Updated</h4>
            <p className="text-sm text-background/70 mb-4">
              Subscribe for exclusive offers and lucky draw updates!
            </p>
            <div className="flex gap-2">
              <Input 
                placeholder="Your email" 
                className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
              />
              <Button variant="hero" size="sm">
                Subscribe
              </Button>
            </div>
            <div className="mt-4 space-y-2 text-sm text-background/70">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                support@shareatfoods.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +91 98765 43210
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/50">
            <p className="flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-primary fill-primary" /> by Shareat Foods
            </p>
            <p>© 2024 Shareat Foods. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
