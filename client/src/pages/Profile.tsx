import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, 
  ShieldCheck, 
  Star, 
  Plus, 
  Briefcase, 
  Image as ImageIcon,
  ChevronLeft,
  Phone,
  CheckCircle2,
  MessageSquare,
  Clock,
  History,
  TrendingUp,
  Wallet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Profile() {
  const { userId } = useParams();
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();
  const [newSkill, setNewSkill] = useState("");
  const isOwnProfile = authUser?.id === userId;

  const { data: profile, isLoading } = useQuery<any>({
    queryKey: [`/api/profile/${userId}`],
  });

  const addSkillMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch("/api/profile/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to add skill");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/profile/${userId}`] });
      setNewSkill("");
    },
  });

  if (isLoading) return <ProfileSkeleton />;
  if (!profile) return <div className="p-20 text-center">User not found</div>;

  const { user, transactions = [] } = profile;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      <header className="bg-white dark:bg-slate-900 border-b sticky top-0 z-50 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-display font-bold text-xl">Professional Profile</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Profile Header & Wallet */}
        <Card className="overflow-hidden border-none shadow-md">
          <div className="h-32 bg-gradient-to-r from-orange-500 to-orange-600" />
          <CardContent className="relative pt-16">
            <div className="absolute -top-12 left-6">
              <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-900 p-1 shadow-lg">
                <div className="w-full h-full rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  {user.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt={user.firstName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-slate-400" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-bold font-display">
                    {user.firstName} {user.lastName}
                  </h2>
                  <div className="flex gap-2">
                    {user.isPhoneVerified && (
                      <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-100 flex gap-1 items-center">
                        <Phone className="w-3 h-3" />
                        Verified Phone
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold">{user.trustScore || '4.8'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span>Response: {user.responseTime || '< 2 hours'}</span>
                  </div>
                </div>
              </div>
              
              <Card className="bg-primary text-white border-none shadow-lg shadow-primary/20 p-4 min-w-[200px] rounded-2xl">
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 opacity-80" />
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">Pula Balance</p>
                    <p className="text-2xl font-black">P{user.balance?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white dark:bg-slate-900 p-1 h-12 rounded-2xl border w-full justify-start gap-2 px-2">
            <TabsTrigger value="overview" className="rounded-xl px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-white">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-display font-bold">Skills & Expertise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill: any) => (
                        <Badge key={skill.id} variant="outline" className="px-3 py-1 text-sm rounded-full bg-slate-50 border-slate-200">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-lg font-display font-bold">Portfolio Showcase</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {profile.portfolio.map((item: any) => (
                        <div key={item.id} className="aspect-video rounded-xl overflow-hidden bg-slate-100 relative group">
                          <img src={item.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-none shadow-sm bg-primary/5">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-widest text-primary/70">Reliability</span>
                      <span className="text-lg font-black text-primary">100%</span>
                    </div>
                    <div className="w-full bg-primary/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: '100%' }} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.length > 0 ? (
                    transactions.map((tx: any) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-bold">Orange Money {tx.type === 'topup' ? 'Topup' : 'Payment'}</p>
                            <p className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-lg">P{tx.amount.toFixed(2)}</p>
                          <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-widest h-5 bg-teal-50 text-teal-700">
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <History className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-500 font-medium">No transactions yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Skeleton className="h-64 w-full rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </div>
  );
}
