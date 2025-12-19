import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Gift, Trophy, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = [{
    path: "/",
    label: "Home",
    icon: Gift
  }, {
    path: "/winners",
    label: "Winners",
    icon: Trophy
  }, {
    path: "/enter",
    label: "Enter Draw",
    icon: Gift
  }];
  const isActive = (path: string) => location.pathname === path;
  return <motion.nav initial={{
    y: -100
  }} animate={{
    y: 0
  }} className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-lg border-b border-border/50 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            
            <div className="hidden sm:block">
              <span className="font-display font-bold text-xl md:text-2xl text-foreground">Shareat</span>
              
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map(link => <Link key={link.path} to={link.path}>
                <Button variant={isActive(link.path) ? "default" : "ghost"} className="gap-2">
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Button>
              </Link>)}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/auth">
              <Button variant="outline" className="gap-2">
                <User className="w-4 h-4" />
                Login
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="glass" size="sm">
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: "auto"
      }} exit={{
        opacity: 0,
        height: 0
      }} className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-2">
              {navLinks.map(link => <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}>
                  <Button variant={isActive(link.path) ? "default" : "ghost"} className="w-full justify-start gap-2">
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Button>
                </Link>)}
              <div className="flex gap-2 mt-2 pt-2 border-t border-border/50">
                <Link to="/auth" className="flex-1" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full gap-2">
                    <User className="w-4 h-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/admin" onClick={() => setIsOpen(false)}>
                  <Button variant="glass">Admin</Button>
                </Link>
              </div>
            </div>
          </motion.div>}
      </div>
    </motion.nav>;
};
export default Navbar;