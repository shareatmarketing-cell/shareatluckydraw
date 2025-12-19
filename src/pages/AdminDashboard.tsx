import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  QrCode, 
  Gift, 
  Trophy, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Users,
  Upload,
  Shuffle,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { currentRewards, validCodes, pastWinners } from "@/lib/mockData";
import confetti from "canvas-confetti";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<null | { name: string; prize: string }>(null);

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "codes", label: "Code Management", icon: QrCode },
    { id: "rewards", label: "Rewards", icon: Gift },
    { id: "draw", label: "Monthly Draw", icon: Trophy },
    { id: "entries", label: "Entries", icon: Users },
  ];

  const stats = [
    { label: "Total Codes", value: validCodes.length, color: "from-primary to-primary-glow" },
    { label: "Redeemed Codes", value: validCodes.filter(c => c.isRedeemed).length, color: "from-accent to-accent-glow" },
    { label: "This Month Entries", value: 156, color: "from-secondary to-gold" },
    { label: "Total Winners", value: pastWinners.length, color: "from-primary to-secondary" },
  ];

  const triggerWinnerConfetti = () => {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#e53935', '#ffc107', '#4caf50']
    });
  };

  const selectRandomWinner = () => {
    const entries = ["Rahul Sharma", "Priya Patel", "Amit Kumar", "Sneha Reddy", "Vikram Singh", "Anjali Gupta"];
    const prizes = currentRewards.map(r => r.title);
    
    const randomName = entries[Math.floor(Math.random() * entries.length)];
    const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
    
    setSelectedWinner({ name: randomName, prize: randomPrize });
    triggerWinnerConfetti();
  };

  const handleLogout = () => {
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">S</span>
              </div>
              <div>
                <span className="font-display font-bold text-lg text-foreground">Shareat</span>
                <span className="block text-xs text-muted-foreground">Admin Panel</span>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-lg border-b border-border px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <h1 className="font-display font-bold text-xl text-foreground capitalize">
                {activeTab === "overview" ? "Dashboard" : activeTab.replace("-", " ")}
              </h1>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">
                View Site
              </Button>
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat, index) => (
                    <Card key={stat.label} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                          <span className="text-primary-foreground text-xl font-bold">{index + 1}</span>
                        </div>
                        <p className="text-3xl font-display font-bold text-foreground">{stat.value}</p>
                        <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Winners</CardTitle>
                    <CardDescription>Last 5 lucky draw winners</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pastWinners.slice(0, 5).map((winner) => (
                        <div key={winner.id} className="flex items-center justify-between p-3 rounded-xl bg-cream">
                          <div>
                            <p className="font-semibold text-foreground">{winner.name}</p>
                            <p className="text-sm text-muted-foreground">{winner.city}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-foreground">{winner.prize}</p>
                            <p className="text-xs text-muted-foreground">{winner.month} {winner.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Code Management Tab */}
            {activeTab === "codes" && (
              <motion.div
                key="codes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Codes</CardTitle>
                    <CardDescription>Bulk upload unique codes via CSV/Excel</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">Drag and drop your CSV file here, or click to browse</p>
                      <Button variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Select File
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Active Codes</CardTitle>
                    <CardDescription>Manage unique codes for this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left p-3 font-semibold text-muted-foreground">Code</th>
                            <th className="text-left p-3 font-semibold text-muted-foreground">Status</th>
                            <th className="text-left p-3 font-semibold text-muted-foreground">Month</th>
                            <th className="text-right p-3 font-semibold text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {validCodes.map((code) => (
                            <tr key={code.id} className="border-b border-border/50">
                              <td className="p-3 font-mono text-sm">{code.code}</td>
                              <td className="p-3">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                  code.isRedeemed
                                    ? "bg-accent/20 text-accent"
                                    : "bg-secondary/20 text-secondary-foreground"
                                }`}>
                                  {code.isRedeemed ? "Redeemed" : "Available"}
                                </span>
                              </td>
                              <td className="p-3 text-sm text-muted-foreground">{code.month} {code.year}</td>
                              <td className="p-3 text-right">
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Rewards Tab */}
            {activeTab === "rewards" && (
              <motion.div
                key="rewards"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-display font-bold text-xl">Current Month Rewards</h2>
                    <p className="text-muted-foreground text-sm">December 2024</p>
                  </div>
                  <Button variant="hero">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Reward
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {currentRewards.map((reward) => (
                    <Card key={reward.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex gap-4 p-4">
                          <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                            <img src={reward.imageUrl} alt={reward.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-2 ${
                              reward.tier === 'grand' ? 'bg-secondary/20 text-secondary-foreground' :
                              reward.tier === 'first' ? 'bg-primary/20 text-primary' :
                              'bg-accent/20 text-accent'
                            }`}>
                              {reward.tier.charAt(0).toUpperCase() + reward.tier.slice(1)} Prize
                            </span>
                            <h3 className="font-display font-bold text-foreground">{reward.title}</h3>
                            <p className="text-sm text-muted-foreground">{reward.description}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button variant="ghost" size="icon">
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Monthly Draw Tab */}
            {activeTab === "draw" && (
              <motion.div
                key="draw"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Random Winner Selection */}
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-br from-secondary/20 to-gold/10">
                      <CardTitle className="flex items-center gap-2">
                        <Shuffle className="w-5 h-5" />
                        Select Random Winner
                      </CardTitle>
                      <CardDescription>Pick a random winner from this month's entries</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      {selectedWinner ? (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-center py-6"
                        >
                          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-secondary to-gold flex items-center justify-center shadow-glow-secondary">
                            <Trophy className="w-10 h-10 text-secondary-foreground" />
                          </div>
                          <h3 className="font-display font-bold text-2xl text-foreground mb-1">
                            🎉 {selectedWinner.name}
                          </h3>
                          <p className="text-muted-foreground mb-4">Won: {selectedWinner.prize}</p>
                          <div className="flex gap-2 justify-center">
                            <Button variant="success">
                              <Check className="w-4 h-4 mr-2" />
                              Confirm Winner
                            </Button>
                            <Button variant="outline" onClick={() => setSelectedWinner(null)}>
                              Re-draw
                            </Button>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground mb-6">156 entries this month</p>
                          <Button variant="golden" size="lg" onClick={selectRandomWinner}>
                            <Shuffle className="w-5 h-5 mr-2" />
                            Pick Random Winner
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Monthly Reset */}
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-br from-destructive/10 to-destructive/5">
                      <CardTitle className="flex items-center gap-2">
                        <RotateCcw className="w-5 h-5" />
                        Monthly Reset
                      </CardTitle>
                      <CardDescription>Archive entries and start fresh for next month</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      {showResetConfirm ? (
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="p-4 rounded-xl bg-destructive/10 border border-destructive/20"
                        >
                          <div className="flex items-start gap-3 mb-4">
                            <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-foreground">Are you absolutely sure?</h4>
                              <p className="text-sm text-muted-foreground">
                                This will archive all current entries and reset the draw. This action cannot be undone.
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="destructive" onClick={() => setShowResetConfirm(false)}>
                              Yes, Reset Month
                            </Button>
                            <Button variant="outline" onClick={() => setShowResetConfirm(false)}>
                              Cancel
                            </Button>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground mb-6">
                            Archives current entries and clears the draw for the new month
                          </p>
                          <Button variant="outline" size="lg" onClick={() => setShowResetConfirm(true)}>
                            <RotateCcw className="w-5 h-5 mr-2" />
                            Reset Monthly Entries
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* Entries Tab */}
            {activeTab === "entries" && (
              <motion.div
                key="entries"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>This Month's Entries</CardTitle>
                    <CardDescription>All participants in the December 2024 draw</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: "Rahul Sharma", email: "rahul@example.com", city: "Mumbai", entries: 3 },
                        { name: "Priya Patel", email: "priya@example.com", city: "Delhi", entries: 5 },
                        { name: "Amit Kumar", email: "amit@example.com", city: "Bangalore", entries: 2 },
                        { name: "Sneha Reddy", email: "sneha@example.com", city: "Hyderabad", entries: 4 },
                        { name: "Vikram Singh", email: "vikram@example.com", city: "Jaipur", entries: 1 },
                      ].map((entry, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-cream">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground font-bold">
                              {entry.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{entry.name}</p>
                              <p className="text-sm text-muted-foreground">{entry.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">{entry.city}</p>
                            <p className="text-sm font-medium text-primary">{entry.entries} entries</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
