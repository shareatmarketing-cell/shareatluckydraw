import { useState, useRef } from "react";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Gift, 
  QrCode, 
  BarChart3,
  Search,
  Settings,
  TrendingUp,
  Plus,
  Upload,
  Trash2,
  FileSpreadsheet,
  Pencil,
  X,
  Trophy,
  Shield,
  Dices,
  Download,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/ClerkAuthContext";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserWithProfile {
  id: string;
  email: string;
  created_at: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface RewardForm {
  name: string;
  description: string;
  month: string;
  image_url: string;
  is_active: boolean;
  is_grand_prize: boolean;
}

interface WinnerForm {
  user_id: string;
  prize_id: string;
  month: string;
  is_public: boolean;
}


const AdminDashboard = () => {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const { getToken } = useClerkAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [newCode, setNewCode] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rewardImageInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const queryClient = useQueryClient();

  // Reward form state
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<string | null>(null);
  const [rewardForm, setRewardForm] = useState<RewardForm>({
    name: "",
    description: "",
    month: format(new Date(), "yyyy-MM-dd"),
    image_url: "",
    is_active: true,
    is_grand_prize: false,
  });

  // Winner form state
  const [winnerDialogOpen, setWinnerDialogOpen] = useState(false);
  const [editingWinner, setEditingWinner] = useState<string | null>(null);
  const [winnerForm, setWinnerForm] = useState<WinnerForm>({
    user_id: "",
    prize_id: "",
    month: format(new Date(), "yyyy-MM-dd"),
    is_public: true,
  });

  // Draw state
  const [drawMonth, setDrawMonth] = useState(format(new Date(), "yyyy-MM") + "-01");
  const [winnerCount, setWinnerCount] = useState(1);
  const [selectedWinners, setSelectedWinners] = useState<any[]>([]);
  const [isPickingWinners, setIsPickingWinners] = useState(false);
  const [confirmSaveWinnersOpen, setConfirmSaveWinnersOpen] = useState(false);
  const [isSavingWinners, setIsSavingWinners] = useState(false);

  const resetRewardForm = () => {
    setRewardForm({
      name: "",
      description: "",
      month: format(new Date(), "yyyy-MM-dd"),
      image_url: "",
      is_active: true,
      is_grand_prize: false,
    });
    setEditingReward(null);
  };

  const resetWinnerForm = () => {
    setWinnerForm({
      user_id: "",
      prize_id: "",
      month: format(new Date(), "yyyy-MM-dd"),
      is_public: true,
    });
    setEditingWinner(null);
  };

  // Fetch all users with profiles and roles
  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-admin-users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch users');
      return data.data || [];
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
      const token = await getToken();
      if (!token) return [];

      const { data, error } = await supabase.functions.invoke('manage-codes', {
        body: { action: 'list' },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data?.data || [];
    },
    enabled: isAdmin,
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

  // Fetch all winners for winners tab
  const { data: winners = [] } = useQuery({
    queryKey: ['admin-winners'],
    queryFn: async () => {
      const { data: winnersData } = await supabase
        .from('winners')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!winnersData || winnersData.length === 0) return [];

      // Get user_ids and prize_ids
      const userIds = winnersData.map(w => w.user_id);
      const prizeIds = winnersData.filter(w => w.prize_id).map(w => w.prize_id);

      // Fetch profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', userIds);

      // Fetch prizes
      const { data: prizesData } = await supabase
        .from('prizes')
        .select('id, name')
        .in('id', prizeIds);

      // Map data
      return winnersData.map(winner => {
        const profile = profiles?.find(p => p.user_id === winner.user_id);
        const prize = prizesData?.find(p => p.id === winner.prize_id);
        return {
          ...winner,
          profiles: { full_name: profile?.full_name || 'Unknown User' },
          prizes: { name: prize?.name || 'No Prize' },
        };
      });
    },
    enabled: isAdmin
  });

  // Fetch draw entries for current month
  const { data: drawEntries = [], refetch: refetchDrawEntries } = useQuery({
    queryKey: ['admin-draw-entries', drawMonth],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-draw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'get_entries', month: drawMonth }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch draw entries');
      return data.data || [];
    },
    enabled: isAdmin
  });

  // Add single code mutation
  const addCodeMutation = useMutation({
    mutationFn: async (code: string) => {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-codes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'create', code: code.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add code');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-codes'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setNewCode("");
      toast.success("Code added successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add code");
    }
  });

  // Add bulk codes mutation
  const addBulkCodesMutation = useMutation({
    mutationFn: async (codes: string[]) => {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-codes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'bulk_create', codes }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add codes');
      return data.count;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['admin-codes'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success(`${count} codes added successfully`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add codes");
    }
  });

  // Delete code mutation
  const deleteCodeMutation = useMutation({
    mutationFn: async (codeId: string) => {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-codes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'delete', id: codeId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete code');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-codes'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success("Code deleted");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete code");
    }
  });

  const handleAddCode = () => {
    if (!newCode.trim()) {
      toast.error("Please enter a code");
      return;
    }
    addCodeMutation.mutate(newCode);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split(/[\r\n]+/).filter(line => line.trim());
      
      if (lines.length === 0) {
        toast.error("No codes found in file");
        return;
      }

      // Skip header if it looks like one
      const codes = lines[0].toLowerCase().includes('code') ? lines.slice(1) : lines;
      
      if (codes.length === 0) {
        toast.error("No codes found in file");
        return;
      }

      addBulkCodesMutation.mutate(codes);
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Add reward mutation
  const addRewardMutation = useMutation({
    mutationFn: async (reward: RewardForm) => {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-prizes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'create',
          name: reward.name,
          description: reward.description,
          month: reward.month,
          image_url: reward.image_url || null,
          is_active: reward.is_active,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add reward');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-prizes'] });
      queryClient.invalidateQueries({ queryKey: ['admin-active-rewards'] });
      setRewardDialogOpen(false);
      resetRewardForm();
      toast.success("Reward added successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add reward");
    }
  });

  // Update reward mutation
  const updateRewardMutation = useMutation({
    mutationFn: async ({ id, reward }: { id: string; reward: RewardForm }) => {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-prizes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'update',
          id,
          name: reward.name,
          description: reward.description,
          month: reward.month,
          image_url: reward.image_url || null,
          is_active: reward.is_active,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update reward');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-prizes'] });
      queryClient.invalidateQueries({ queryKey: ['admin-active-rewards'] });
      setRewardDialogOpen(false);
      resetRewardForm();
      toast.success("Reward updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update reward");
    }
  });

  // Delete reward mutation
  const deleteRewardMutation = useMutation({
    mutationFn: async (rewardId: string) => {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-prizes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'delete',
          id: rewardId,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete reward');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-prizes'] });
      queryClient.invalidateQueries({ queryKey: ['admin-active-rewards'] });
      toast.success("Reward deleted");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete reward");
    }
  });

  // Add winner mutation
  const addWinnerMutation = useMutation({
    mutationFn: async (winner: WinnerForm) => {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-winners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'create',
          user_id: winner.user_id,
          prize_id: winner.prize_id || null,
          month: winner.month,
          is_public: winner.is_public,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add winner');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-winners'] });
      setWinnerDialogOpen(false);
      resetWinnerForm();
      toast.success("Winner added successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add winner");
    }
  });

  // Update winner mutation
  const updateWinnerMutation = useMutation({
    mutationFn: async ({ id, winner }: { id: string; winner: WinnerForm }) => {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-winners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'update',
          id,
          user_id: winner.user_id,
          prize_id: winner.prize_id || null,
          month: winner.month,
          is_public: winner.is_public,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update winner');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-winners'] });
      setWinnerDialogOpen(false);
      resetWinnerForm();
      toast.success("Winner updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update winner");
    }
  });

  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: 'admin' | 'moderator' | 'user' }) => {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-user-roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId, new_role: newRole }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update role');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success("Role updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update role");
    }
  });

  // Delete winner mutation
  const deleteWinnerMutation = useMutation({
    mutationFn: async (winnerId: string) => {
      const { error } = await supabase.from('winners').delete().eq('id', winnerId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-winners'] });
      toast.success("Winner deleted");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete winner");
    }
  });

  const handleRewardImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setIsUploadingImage(true);
    try {
      const token = await getToken();
      const fileExt = file.name.split('.').pop();
      const fileName = `rewards/${crypto.randomUUID()}.${fileExt}`;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-reward-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Upload failed');

      setRewardForm({ ...rewardForm, image_url: data.url });
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
      if (rewardImageInputRef.current) {
        rewardImageInputRef.current.value = '';
      }
    }
  };

  const handleSaveReward = () => {
    if (!rewardForm.name.trim()) {
      toast.error("Please enter a reward name");
      return;
    }
    if (editingReward) {
      updateRewardMutation.mutate({ id: editingReward, reward: rewardForm });
    } else {
      addRewardMutation.mutate(rewardForm);
    }
  };

  const handleSaveWinner = () => {
    if (!winnerForm.user_id) {
      toast.error("Please select a user");
      return;
    }
    if (editingWinner) {
      updateWinnerMutation.mutate({ id: editingWinner, winner: winnerForm });
    } else {
      addWinnerMutation.mutate(winnerForm);
    }
  };

  const handleEditReward = (prize: any) => {
    setEditingReward(prize.id);
    setRewardForm({
      name: prize.name,
      description: prize.description || "",
      month: prize.month,
      image_url: prize.image_url || "",
      is_active: prize.is_active ?? true,
      is_grand_prize: prize.is_grand_prize ?? false,
    });
    setRewardDialogOpen(true);
  };

  const handleEditWinner = (winner: any) => {
    setEditingWinner(winner.id);
    setWinnerForm({
      user_id: winner.user_id,
      prize_id: winner.prize_id || "",
      month: winner.month,
      is_public: winner.is_public ?? true,
    });
    setWinnerDialogOpen(true);
  };

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
    { id: "roles", label: "Roles", icon: Shield },
    { id: "codes", label: "Codes", icon: QrCode },
    { id: "rewards", label: "Rewards", icon: Gift },
    { id: "draw", label: "Draw", icon: Dices },
    { id: "winners", label: "Winners", icon: Trophy },
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

          {activeTab === "roles" && (
            <motion.div
              key="roles"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="border-0 shadow-soft">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-lg font-semibold">Role Management</CardTitle>
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
                          <th className="text-left p-3 font-medium text-muted-foreground">Current Role</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Change Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user: any) => (
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
                            <td className="p-3">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === 'admin'
                                  ? "bg-rose-100 text-rose-700"
                                  : user.role === 'moderator'
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}>
                                {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'User'}
                              </span>
                            </td>
                            <td className="p-3">
                              <Select
                                value={user.role || 'user'}
                                onValueChange={(value: 'admin' | 'moderator' | 'user') => 
                                  updateRoleMutation.mutate({ userId: user.user_id, newRole: value })
                                }
                                disabled={updateRoleMutation.isPending}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">User</SelectItem>
                                  <SelectItem value="moderator">Moderator</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
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
              className="space-y-6"
            >
              {/* Add Code Section */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Add Codes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Single Code Input */}
                    <div className="flex-1">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter code (e.g., ABC123)"
                          value={newCode}
                          onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddCode()}
                          className="font-mono"
                        />
                        <Button 
                          onClick={handleAddCode}
                          disabled={addCodeMutation.isPending}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </div>

                    {/* Bulk Upload */}
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".csv,.txt"
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={addBulkCodesMutation.isPending}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Bulk Upload (CSV)
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    <FileSpreadsheet className="w-3 h-3 inline mr-1" />
                    For bulk upload, use a CSV or TXT file with one code per line
                  </p>
                </CardContent>
              </Card>

              {/* Codes Table */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    All Codes ({codes.length})
                  </CardTitle>
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
                          <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
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
                            <td className="p-3 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteCodeMutation.mutate(code.id)}
                                disabled={deleteCodeMutation.isPending}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                        {codes.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-muted-foreground">
                              No codes found. Add your first code above.
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
              className="space-y-6"
            >
              {/* Add Reward Button */}
              <div className="flex justify-end">
                <Button onClick={() => { resetRewardForm(); setRewardDialogOpen(true); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Reward
                </Button>
              </div>

              {/* Rewards Grid */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    All Rewards ({prizes.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {prizes.map((prize) => (
                      <Card key={prize.id} className={`overflow-hidden ${prize.is_grand_prize ? 'ring-2 ring-yellow-500 ring-offset-2' : ''}`}>
                        <CardContent className="p-4">
                          {prize.image_url && (
                            <div className="relative">
                              <img 
                                src={prize.image_url} 
                                alt={prize.name}
                                className="w-full h-32 object-cover rounded-lg mb-3"
                              />
                              {prize.is_grand_prize && (
                                <div className="absolute top-2 left-2 flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                                  <Sparkles className="w-3 h-3" />
                                  Grand Prize
                                </div>
                              )}
                            </div>
                          )}
                          {!prize.image_url && (
                            <div className="relative w-full h-32 bg-muted rounded-lg mb-3 flex items-center justify-center">
                              <Gift className="w-8 h-8 text-muted-foreground" />
                              {prize.is_grand_prize && (
                                <div className="absolute top-2 left-2 flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                                  <Sparkles className="w-3 h-3" />
                                  Grand Prize
                                </div>
                              )}
                            </div>
                          )}
                          <h3 className="font-semibold text-foreground">{prize.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{prize.description}</p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                prize.is_active 
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}>
                                {prize.is_active ? "Active" : "Inactive"}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(prize.month), 'MMM yyyy')}
                            </span>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleEditReward(prize)}
                            >
                              <Pencil className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deleteRewardMutation.mutate(prize.id)}
                              disabled={deleteRewardMutation.isPending}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {prizes.length === 0 && (
                      <div className="col-span-full p-8 text-center text-muted-foreground">
                        No rewards found. Add your first reward.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "draw" && (
            <motion.div
              key="draw"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Draw Controls */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Lucky Draw Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Month Selector */}
                  <div className="flex flex-wrap gap-4 items-end">
                    <div className="space-y-2">
                      <Label>Select Month</Label>
                      <Input
                        type="month"
                        value={drawMonth.slice(0, 7)}
                        onChange={(e) => {
                          setDrawMonth(e.target.value + "-01");
                          setSelectedWinners([]);
                        }}
                        className="w-48"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Number of Winners</Label>
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        value={winnerCount}
                        onChange={(e) => setWinnerCount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-32"
                      />
                    </div>
                    <Button
                      onClick={async () => {
                        setIsPickingWinners(true);
                        try {
                          const token = await getToken();
                          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-draw`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`,
                            },
                            body: JSON.stringify({ action: 'pick_winners', month: drawMonth, count: winnerCount }),
                          });
                          const data = await response.json();
                          if (!response.ok) throw new Error(data.error || 'Failed to pick winners');
                          setSelectedWinners(data.data || []);
                          toast.success(`${data.data?.length || 0} winner(s) selected!`);
                        } catch (error: any) {
                          toast.error(error.message || 'Failed to pick winners');
                        } finally {
                          setIsPickingWinners(false);
                        }
                      }}
                      disabled={isPickingWinners || drawEntries.length === 0}
                      className="gap-2"
                    >
                      {isPickingWinners ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                          Picking...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Pick Random Winners
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (drawEntries.length === 0) {
                          toast.error('No entries to download');
                          return;
                        }
                        const csvContent = [
                          ['Name', 'Phone', 'Code', 'Entry Date'].join(','),
                          ...drawEntries.map((entry: any) => [
                            `"${entry.full_name || ''}"`,
                            `"${entry.phone || ''}"`,
                            `"${entry.code || ''}"`,
                            `"${format(new Date(entry.created_at), 'yyyy-MM-dd HH:mm')}"`,
                          ].join(','))
                        ].join('\n');
                        
                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.setAttribute('href', url);
                        link.setAttribute('download', `draw-entries-${drawMonth.slice(0, 7)}.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        toast.success('CSV downloaded');
                      }}
                      disabled={drawEntries.length === 0}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Entries CSV
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        if (!confirm('Are you sure you want to reset all draw entries for this month? This action cannot be undone.')) return;
                        try {
                          const token = await getToken();
                          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-draw`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`,
                            },
                            body: JSON.stringify({ action: 'reset_entries', month: drawMonth }),
                          });
                          const data = await response.json();
                          if (!response.ok) throw new Error(data.error || 'Failed to reset entries');
                          toast.success('Draw entries reset successfully');
                          refetchDrawEntries();
                          setSelectedWinners([]);
                          queryClient.invalidateQueries({ queryKey: ['admin-codes'] });
                          queryClient.invalidateQueries({ queryKey: ['admin-codes-stats'] });
                        } catch (error: any) {
                          toast.error(error.message || 'Failed to reset entries');
                        }
                      }}
                      disabled={drawEntries.length === 0}
                      className="gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset Draw Entries
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Selected Winners */}
              {selectedWinners.length > 0 && (
                <Card className="border-0 shadow-soft border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-primary" />
                      Selected Winners ({selectedWinners.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {selectedWinners.map((winner: any, index: number) => (
                        <div key={winner.user_id} className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{winner.full_name}</p>
                            <p className="text-sm text-muted-foreground">{winner.phone || 'No phone'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const csvContent = [
                            ['Rank', 'Name', 'Phone'].join(','),
                            ...selectedWinners.map((winner: any, index: number) => [
                              index + 1,
                              `"${winner.full_name || ''}"`,
                              `"${winner.phone || ''}"`,
                            ].join(','))
                          ].join('\n');
                          
                          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.setAttribute('href', url);
                          link.setAttribute('download', `winners-${drawMonth.slice(0, 7)}.csv`);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          toast.success('Winners CSV downloaded');
                        }}
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download Winners CSV
                      </Button>
                      <Button
                        onClick={() => setConfirmSaveWinnersOpen(true)}
                        className="gap-2"
                      >
                        <Trophy className="w-4 h-4" />
                        Save to Winners Table
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Draw Entries Table */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Draw Entries for {format(new Date(drawMonth), 'MMMM yyyy')} ({drawEntries.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-3 font-medium text-muted-foreground">#</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Phone</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Code Used</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Entry Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {drawEntries.map((entry: any, index: number) => (
                          <tr key={entry.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="p-3 text-muted-foreground">{index + 1}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-sm font-medium text-primary">
                                    {entry.full_name?.charAt(0)?.toUpperCase() || 'U'}
                                  </span>
                                </div>
                                <span className="font-medium text-foreground">{entry.full_name || 'Unknown'}</span>
                              </div>
                            </td>
                            <td className="p-3 text-muted-foreground">{entry.phone || '-'}</td>
                            <td className="p-3 font-mono text-sm text-foreground">{entry.code}</td>
                            <td className="p-3 text-muted-foreground">
                              {format(new Date(entry.created_at), 'MMM dd, yyyy HH:mm')}
                            </td>
                          </tr>
                        ))}
                        {drawEntries.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-muted-foreground">
                              No entries found for {format(new Date(drawMonth), 'MMMM yyyy')}
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

          {activeTab === "winners" && (
            <motion.div
              key="winners"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Add Winner Button */}
              <div className="flex justify-end">
                <Button onClick={() => { resetWinnerForm(); setWinnerDialogOpen(true); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Winner
                </Button>
              </div>

              {/* Winners Table */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    All Winners ({winners.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-3 font-medium text-muted-foreground">Winner</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Prize</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Month</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                          <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {winners.map((winner: any) => (
                          <tr key={winner.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Trophy className="w-4 h-4 text-primary" />
                                </div>
                                <span className="font-medium text-foreground">
                                  {winner.profiles?.full_name || 'Unknown User'}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-foreground">
                              {winner.prizes?.name || 'No prize assigned'}
                            </td>
                            <td className="p-3 text-muted-foreground">
                              {format(new Date(winner.month), 'MMM yyyy')}
                            </td>
                            <td className="p-3">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                winner.is_public
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}>
                                {winner.is_public ? "Public" : "Hidden"}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex gap-1 justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditWinner(winner)}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteWinnerMutation.mutate(winner.id)}
                                  disabled={deleteWinnerMutation.isPending}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {winners.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-muted-foreground">
                              No winners found. Add your first winner.
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

        {/* Reward Dialog */}
        <Dialog open={rewardDialogOpen} onOpenChange={(open) => { setRewardDialogOpen(open); if (!open) resetRewardForm(); }}>
          <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col overflow-hidden">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>{editingReward ? "Edit Reward" : "Add New Reward"}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="flex-1 overflow-y-auto pr-4 -mr-4">
              <div className="space-y-4 py-4 pr-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., iPhone 15 Pro"
                  value={rewardForm.name}
                  onChange={(e) => setRewardForm({ ...rewardForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the reward..."
                  value={rewardForm.description}
                  onChange={(e) => setRewardForm({ ...rewardForm, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <Input
                  id="month"
                  type="date"
                  value={rewardForm.month}
                  onChange={(e) => setRewardForm({ ...rewardForm, month: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <div className="space-y-3">
                  {rewardForm.image_url && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={rewardForm.image_url}
                        alt="Reward preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setRewardForm({ ...rewardForm, image_url: '' })}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={rewardImageInputRef}
                      onChange={handleRewardImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => rewardImageInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className="flex-1"
                    >
                      {isUploadingImage ? (
                        <>
                          <div className="animate-spin w-4 h-4 mr-2 border-2 border-primary border-t-transparent rounded-full" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">Or enter URL manually:</div>
                  <Input
                    id="image_url"
                    placeholder="https://example.com/image.jpg"
                    value={rewardForm.image_url}
                    onChange={(e) => setRewardForm({ ...rewardForm, image_url: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Active</Label>
                <Switch
                  id="is_active"
                  checked={rewardForm.is_active}
                  onCheckedChange={(checked) => setRewardForm({ ...rewardForm, is_active: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <Label htmlFor="is_grand_prize">Grand Prize</Label>
                </div>
                <Switch
                  id="is_grand_prize"
                  checked={rewardForm.is_grand_prize}
                  onCheckedChange={(checked) => setRewardForm({ ...rewardForm, is_grand_prize: checked })}
                />
              </div>
              </div>
            </ScrollArea>
            <div className="flex gap-2 justify-end pt-4 border-t flex-shrink-0">
              <Button variant="outline" onClick={() => { setRewardDialogOpen(false); resetRewardForm(); }}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveReward}
                disabled={addRewardMutation.isPending || updateRewardMutation.isPending}
              >
                {editingReward ? "Update" : "Add"} Reward
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Winner Dialog */}
        <Dialog open={winnerDialogOpen} onOpenChange={(open) => { setWinnerDialogOpen(open); if (!open) resetWinnerForm(); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingWinner ? "Edit Winner" : "Add New Winner"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="winner_user">User *</Label>
                <Select
                  value={winnerForm.user_id}
                  onValueChange={(value) => setWinnerForm({ ...winnerForm, user_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user: any) => (
                      <SelectItem key={user.user_id} value={user.user_id}>
                        {user.full_name || 'Unknown User'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="winner_prize">Prize</Label>
                <Select
                  value={winnerForm.prize_id}
                  onValueChange={(value) => setWinnerForm({ ...winnerForm, prize_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a prize (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {prizes.map((prize: any) => (
                      <SelectItem key={prize.id} value={prize.id}>
                        {prize.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="winner_month">Month</Label>
                <Input
                  id="winner_month"
                  type="date"
                  value={winnerForm.month}
                  onChange={(e) => setWinnerForm({ ...winnerForm, month: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="winner_is_public">Show on Leaderboard</Label>
                <Switch
                  id="winner_is_public"
                  checked={winnerForm.is_public}
                  onCheckedChange={(checked) => setWinnerForm({ ...winnerForm, is_public: checked })}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => { setWinnerDialogOpen(false); resetWinnerForm(); }}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveWinner}
                disabled={addWinnerMutation.isPending || updateWinnerMutation.isPending}
              >
                {editingWinner ? "Update" : "Add"} Winner
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Confirm Save Winners Dialog */}
        <Dialog open={confirmSaveWinnersOpen} onOpenChange={setConfirmSaveWinnersOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Confirm Save Winners
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to add {selectedWinners.length} winner(s) to the Winners table for {format(new Date(drawMonth), 'MMMM yyyy')}?
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-48 overflow-y-auto my-4">
              <div className="space-y-2">
                {selectedWinners.map((winner: any, index: number) => (
                  <div key={winner.user_id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium">{winner.full_name}</span>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                variant="outline" 
                onClick={() => setConfirmSaveWinnersOpen(false)}
                disabled={isSavingWinners}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  setIsSavingWinners(true);
                  try {
                    const token = await getToken();
                    let successCount = 0;
                    
                    for (const winner of selectedWinners) {
                      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-winners`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          action: 'create',
                          user_id: winner.user_id,
                          prize_id: null,
                          month: drawMonth,
                          is_public: true,
                        }),
                      });
                      
                      if (response.ok) {
                        successCount++;
                      }
                    }
                    
                    if (successCount === selectedWinners.length) {
                      toast.success(`Successfully added ${successCount} winner(s) to the Winners table!`);
                    } else {
                      toast.warning(`Added ${successCount} of ${selectedWinners.length} winners. Some may already exist.`);
                    }
                    
                    queryClient.invalidateQueries({ queryKey: ['admin-winners'] });
                    setConfirmSaveWinnersOpen(false);
                    setSelectedWinners([]);
                  } catch (error: any) {
                    toast.error(error.message || 'Failed to save winners');
                  } finally {
                    setIsSavingWinners(false);
                  }
                }}
                disabled={isSavingWinners}
                className="gap-2"
              >
                {isSavingWinners ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Trophy className="w-4 h-4" />
                    Confirm & Save
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminDashboard;
