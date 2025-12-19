import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Gift, 
  QrCode, 
  BarChart3,
  Search,
  Settings,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";

interface UserWithProfile {
  id: string;
  email: string;
  created_at: string;
  full_name: string | null;
  avatar_url: string | null;
}

const AdminDashboard = () => {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all users with profiles
  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profileError) throw profileError;

      return profiles?.map(p => ({
        id: p.id,
        email: p.full_name || 'Unknown',
        created_at: p.created_at,
        full_name: p.full_name,
        avatar_url: p.avatar_url,
        user_id: p.user_id
      })) || [];
    },
    enabled: isAdmin
  });

  // Fetch codes stats
  const { data: codesStats } = useQuery({
    queryKey: ['admin-codes-stats'],
    queryFn: async () => {
      const { data: allCodes } = await supabase.from('codes').select('*');
      const total = allCodes?.length || 0;
      const redeemed = allCodes?.filter(c => c.is_used)?.length || 0;
      return { total, redeemed };
    },
    enabled: isAdmin
  });

  // Fetch active rewards
  const { data: activeRewards = 0 } = useQuery({
    queryKey: ['admin-active-rewards'],
    queryFn: async () => {
      const { data, count } = await supabase
        .from('prizes')
        .select('*', { count: 'exact' })
        .eq('is_active', true);
      return count || 0;
    },
    enabled: isAdmin
  });

  // Fetch all codes for the codes tab
  const { data: codes = [] } = useQuery({
    queryKey: ['admin-codes'],
    queryFn: async () => {
      const { data } = await supabase
        .from('codes')
        .select('*')
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: isAdmin
  });

  // Fetch all prizes for rewards tab
  const { data: prizes = [] } = useQuery({
    queryKey: ['admin-prizes'],
    queryFn: async () => {
      const { data } = await supabase
        .from('prizes')
        .select('*')
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: isAdmin
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const stats = [
    { 
      label: "Total Users", 
      value: users.length, 
      icon: Users,
      bgColor: "bg-rose-50",
      iconColor: "text-rose-500"
    },
    { 
      label: "Active Rewards", 
      value: activeRewards, 
      icon: TrendingUp,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-500"
    },
    { 
      label: "Total Codes", 
      value: codesStats?.total || 0, 
      icon: QrCode,
      bgColor: "bg-red-50",
      iconColor: "text-red-500"
    },
    { 
      label: "Codes Redeemed", 
      value: codesStats?.redeemed || 0, 
      icon: Gift,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600"
    },
  ];

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: "users", label: "Users", icon: Users },
    { id: "codes", label: "Codes", icon: QrCode },
    { id: "rewards", label: "Rewards", icon: Gift },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            <span className="text-foreground">Admin</span>{" "}
            <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage users, rewards, and redemption codes
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-0 shadow-soft">
              <CardContent className="p-4 flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 p-1 bg-card rounded-xl border border-border overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="border-0 shadow-soft">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-lg font-semibold">User Management</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-3 font-medium text-muted-foreground">User</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Joined</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-9 h-9">
                                  <AvatarImage src={user.avatar_url || undefined} />
                                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                    {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-foreground">
                                  {user.full_name || 'Unknown User'}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-muted-foreground">
                              {format(new Date(user.created_at), 'MM/dd/yyyy')}
                            </td>
                            <td className="p-3">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-primary border-primary hover:bg-primary/5"
                              >
                                <Settings className="w-3 h-3 mr-1" />
                                Manage
                              </Button>
                            </td>
                          </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                          <tr>
                            <td colSpan={3} className="p-8 text-center text-muted-foreground">
                              No users found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "codes" && (
            <motion.div
              key="codes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Code Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-3 font-medium text-muted-foreground">Code</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Created</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Used At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {codes.map((code) => (
                          <tr key={code.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="p-3 font-mono text-sm">{code.code}</td>
                            <td className="p-3">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                code.is_used
                                  ? "bg-red-100 text-red-700"
                                  : "bg-emerald-100 text-emerald-700"
                              }`}>
                                {code.is_used ? "Used" : "Available"}
                              </span>
                            </td>
                            <td className="p-3 text-muted-foreground">
                              {format(new Date(code.created_at), 'MM/dd/yyyy')}
                            </td>
                            <td className="p-3 text-muted-foreground">
                              {code.used_at ? format(new Date(code.used_at), 'MM/dd/yyyy') : '-'}
                            </td>
                          </tr>
                        ))}
                        {codes.length === 0 && (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-muted-foreground">
                              No codes found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "rewards" && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Rewards Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {prizes.map((prize) => (
                      <Card key={prize.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          {prize.image_url && (
                            <img 
                              src={prize.image_url} 
                              alt={prize.name}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                            />
                          )}
                          <h3 className="font-semibold text-foreground">{prize.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{prize.description}</p>
                          <div className="flex items-center justify-between mt-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              prize.is_active 
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-gray-100 text-gray-600"
                            }`}>
                              {prize.is_active ? "Active" : "Inactive"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(prize.month), 'MMM yyyy')}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {prizes.length === 0 && (
                      <div className="col-span-full p-8 text-center text-muted-foreground">
                        No rewards found
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Analytics</CardTitle>
                </CardHeader>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Analytics dashboard coming soon</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
