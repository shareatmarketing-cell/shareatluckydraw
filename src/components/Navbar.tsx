import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Gift, User, Menu, X, LogOut, LayoutDashboard, Clock, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import shareatLogo from "@/assets/shareat-logo.png";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, isAdmin, signOut } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitials = userName.slice(0, 2).toUpperCase();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-lg border-b border-border/50 shadow-soft"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src={shareatLogo} alt="Shareat" className="h-10 md:h-12 w-auto" />
          </Link>

          {/* Center Navigation - Logged In */}
          {user ? (
            <div className="hidden md:flex items-center gap-1">
              <Link to="/dashboard">
                <Button 
                  variant={isActive("/dashboard") ? "default" : "ghost"} 
                  className="gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/rewards">
                <Button 
                  variant={isActive("/rewards") ? "default" : "ghost"} 
                  className="gap-2"
                >
                  <Gift className="w-4 h-4" />
                  Rewards
                </Button>
              </Link>
              <Link to="/winners">
                <Button 
                  variant={isActive("/winners") ? "default" : "ghost"} 
                  className="gap-2"
                >
                  <Clock className="w-4 h-4" />
                  History
                </Button>
              </Link>
              <Link to="/profile">
                <Button 
                  variant={isActive("/profile") ? "default" : "ghost"} 
                  className="gap-2"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Button>
              </Link>
            </div>
          ) : (
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
          )}

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* Points Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card">
                  <Gift className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">0 pts</span>
                </div>
                
                {/* User Avatar with Dropdown */}
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <Link to="/admin/dashboard">
                      <Button variant="outline" size="sm">Admin</Button>
                    </Link>
                  )}
                  <Avatar className="w-9 h-9 border-2 border-primary/20 cursor-pointer" onClick={() => signOut()}>
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </div>
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

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden py-4 border-t border-border/50"
          >
            <div className="flex flex-col gap-2">
              {user ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center gap-3 px-2 py-3 mb-2 border-b border-border/50">
                    <Avatar className="w-10 h-10 border-2 border-primary/20">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{userName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10">
                      <Gift className="w-3 h-3 text-primary" />
                      <span className="text-xs font-semibold text-primary">0 pts</span>
                    </div>
                  </div>

                  <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button variant={isActive("/dashboard") ? "default" : "ghost"} className="w-full justify-start gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/rewards" onClick={() => setIsOpen(false)}>
                    <Button variant={isActive("/rewards") ? "default" : "ghost"} className="w-full justify-start gap-2">
                      <Gift className="w-4 h-4" />
                      Rewards
                    </Button>
                  </Link>
                  <Link to="/winners" onClick={() => setIsOpen(false)}>
                    <Button variant={isActive("/winners") ? "default" : "ghost"} className="w-full justify-start gap-2">
                      <Clock className="w-4 h-4" />
                      History
                    </Button>
                  </Link>
                  <Link to="/profile" onClick={() => setIsOpen(false)}>
                    <Button variant={isActive("/profile") ? "default" : "ghost"} className="w-full justify-start gap-2">
                      <User className="w-4 h-4" />
                      Profile
                    </Button>
                  </Link>
                  <Link to="/enter" onClick={() => setIsOpen(false)}>
                    <Button variant={isActive("/enter") ? "default" : "ghost"} className="w-full justify-start gap-2">
                      <Ticket className="w-4 h-4" />
                      Enter Code
                    </Button>
                  </Link>
                  
                  {isAdmin && (
                    <Link to="/admin/dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-start gap-2 mt-2">
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-2 text-destructive mt-2"
                    onClick={() => { signOut(); setIsOpen(false); }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
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
                  <div className="pt-2 border-t border-border/50 mt-2">
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full gap-2">
                        <User className="w-4 h-4" />
                        Login
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
