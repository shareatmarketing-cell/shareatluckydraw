import { Heart, Instagram, Facebook, Twitter, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">S</span>
            </div>
            <span className="font-display font-bold text-xl">Shareat</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-background/70">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/auth" className="hover:text-primary transition-colors">Enter Draw</Link>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          </div>

          {/* Social */}
          <div className="flex items-center gap-3">
            {[Instagram, Facebook, Twitter].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-background/50">
          <p className="flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-primary fill-primary" /> by Shareat Foods
          </p>
          <a href="mailto:support@shareatfoods.com" className="flex items-center gap-2 hover:text-background/70 transition-colors">
            <Mail className="w-4 h-4" />
            support@shareatfoods.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
