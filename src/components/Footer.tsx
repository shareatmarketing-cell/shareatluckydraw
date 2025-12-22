import { motion } from "framer-motion";
import { Heart, Instagram, Facebook, Twitter, Mail, Phone, MapPin, Sparkles, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const socialLinks = [
  { Icon: Instagram, href: "#", label: "Instagram", color: "hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-400" },
  { Icon: Facebook, href: "#", label: "Facebook", color: "hover:bg-blue-600" },
  { Icon: Twitter, href: "#", label: "Twitter", color: "hover:bg-sky-500" },
];

const Footer = () => {
  return (
    <footer className="relative bg-foreground text-background overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-40 h-40 border border-background/5 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-10 -left-10 w-32 h-32 border border-background/5 rounded-full"
        />
      </div>

      {/* Main Footer */}
      <div className="container px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-5">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20"
              >
                <Gift className="w-6 h-6 text-primary-foreground" />
              </motion.div>
              <div>
                <span className="font-display font-bold text-2xl bg-gradient-to-r from-background to-background/80 bg-clip-text">Shareat</span>
                <p className="text-xs text-background/50">Lucky Draw Portal</p>
              </div>
            </div>
            <p className="text-background/60 text-sm mb-6 leading-relaxed">
              Delicious, hygienic snacks that bring joy to every bite. 
              Join our monthly lucky draw and win amazing prizes!
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3">
              {socialLinks.map(({ Icon, href, label, color }, index) => (
                <motion.a
                  key={label}
                  href={href}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-11 h-11 rounded-xl bg-background/10 flex items-center justify-center transition-all duration-300 ${color} group`}
                  aria-label={label}
                >
                  <Icon className="w-5 h-5 group-hover:text-white transition-colors" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-display font-bold text-lg mb-5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/rewards", label: "Rewards" },
                { to: "/winners", label: "Winners" },
                { to: "/dashboard", label: "My Dashboard" },
              ].map((link, index) => (
                <motion.li 
                  key={link.to}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link 
                    to={link.to} 
                    className="text-background/60 hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary group-hover:scale-150 transition-all duration-300" />
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-display font-bold text-lg mb-5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-secondary" />
              About
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: "#", label: "Our Story" },
                { href: "#", label: "Products" },
                { href: "#", label: "Contact Us" },
                { href: "#", label: "Terms & Conditions" },
              ].map((link, index) => (
                <motion.li 
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <a 
                    href={link.href} 
                    className="text-background/60 hover:text-secondary transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 group-hover:bg-secondary group-hover:scale-150 transition-all duration-300" />
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter & Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-display font-bold text-lg mb-5 flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Stay Updated
            </h4>
            <p className="text-sm text-background/60 mb-4">
              Subscribe for exclusive offers and lucky draw updates!
            </p>
            <div className="flex gap-2 mb-6">
              <Input 
                placeholder="Your email" 
                className="bg-background/10 border-background/20 text-background placeholder:text-background/40 focus:border-primary/50 focus:ring-primary/20"
              />
              <Button variant="hero" size="sm" className="shrink-0">
                Subscribe
              </Button>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <motion.a 
                href="mailto:support@shareatfoods.com"
                whileHover={{ x: 3 }}
                className="flex items-center gap-3 text-background/60 hover:text-primary transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                support@shareatfoods.com
              </motion.a>
              <motion.a 
                href="tel:+919876543210"
                whileHover={{ x: 3 }}
                className="flex items-center gap-3 text-background/60 hover:text-primary transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                +91 98765 43210
              </motion.a>
              <motion.div 
                whileHover={{ x: 3 }}
                className="flex items-center gap-3 text-background/60 group"
              >
                <div className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                Mumbai, India
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10 relative z-10">
        <div className="container px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/50">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2"
            >
              Made with 
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
              >
                <Heart className="w-4 h-4 text-primary fill-primary" />
              </motion.span>
              by Shareat Foods
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              © 2024 Shareat Foods. All rights reserved.
            </motion.p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
