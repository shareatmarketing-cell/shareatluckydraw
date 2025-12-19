import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Gift, User, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import shareatLogo from "@/assets/shareat-logo.png";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-lg border-b border-border/50 shadow-soft"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={shareatLogo} alt="Shareat" className="h-10 md:h-12 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Link to="/enter">
              <Button variant={isActive("/enter") ? "default" : "ghost"} className="gap-2">
                <Gift className="w-4 h-4" />
                Enter Draw
              </Button>
            </Link>
            <Link to="/rewards">
              <Button variant={isActive("/rewards") ? "default" : "ghost"} className="gap-2">
                Rewards
              </Button>
            </Link>
            <Link to="/winners">
              <Button variant={isActive("/winners") ? "default" : "ghost"} className="gap-2">
                Winners
              </Button>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" className="gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin/dashboard">
                    <Button variant="glass" size="sm">Admin</Button>
                  </Link>
                )}
                <Button variant="ghost" size="icon" onClick={() => signOut()}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="outline" className="gap-2">
                  <User className="w-4 h-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden py-4 border-t border-border/50"
          >
            <div className="flex flex-col gap-2">
              <Link to="/enter" onClick={() => setIsOpen(false)}>
                <Button variant={isActive("/enter") ? "default" : "ghost"} className="w-full justify-start gap-2">
                  <Gift className="w-4 h-4" />
                  Enter Draw
                </Button>
              </Link>
              <Link to="/rewards" onClick={() => setIsOpen(false)}>
                <Button variant={isActive("/rewards") ? "default" : "ghost"} className="w-full justify-start gap-2">
                  <Gift className="w-4 h-4" />
                  Rewards
                </Button>
              </Link>
              <Link to="/winners" onClick={() => setIsOpen(false)}>
                <Button variant={isActive("/winners") ? "default" : "ghost"} className="w-full justify-start">
                  Winners
                </Button>
              </Link>
              <div className="flex gap-2 mt-2 pt-2 border-t border-border/50">
                {user ? (
                  <>
                    <Link to="/dashboard" className="flex-1" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="ghost" onClick={() => { signOut(); setIsOpen(false); }}>
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Link to="/auth" className="flex-1" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full gap-2">
                      <User className="w-4 h-4" />
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
