import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Gift, User, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import shareatLogo from "@/assets/shareat-logo.png";
import { useAuth } from "@/contexts/ClerkAuthContext";
import { UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useUser();
  const { user, profile, isAdmin, signOut } = useAuth();
  const isActive = (path: string) => location.pathname === path;
  const isAuthPage = location.pathname === "/auth";

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
          {isSignedIn ? (
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
          ) : null}

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {isSignedIn ? (
              <>
                {/* User Avatar with Clerk UserButton */}
                <div className="flex items-center gap-2">
                  <Link to="/admin/dashboard">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!isAdmin}
                      title={isAdmin ? "Open Admin Dashboard" : "Admin access required"}
                    >
                      Admin
                    </Button>
                  </Link>
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-9 h-9 border-2 border-primary/20",
                      }
                    }}
                  />
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
              {isSignedIn ? (
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
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>

                  <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button variant={isActive("/dashboard") ? "default" : "ghost"} className="w-full justify-start gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/profile" onClick={() => setIsOpen(false)}>
                    <Button variant={isActive("/profile") ? "default" : "ghost"} className="w-full justify-start gap-2">
                      <User className="w-4 h-4" />
                      Profile
                    </Button>
                  </Link>
                  
                  <Link to="/admin/dashboard" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 mt-2"
                      disabled={!isAdmin}
                      title={isAdmin ? "Open Admin Dashboard" : "Admin access required"}
                    >
                      Admin Panel
                    </Button>
                  </Link>
                  
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
                  <div className={!isAuthPage ? "pt-2 border-t border-border/50 mt-2" : ""}>
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
