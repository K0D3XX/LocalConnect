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
  ChevronRight,
  MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
  const { userId } = useParams();
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();
  const [newSkill, setNewSkill] = useState("");
  const isOwnProfile = authUser?.id === userId;

  const { data: profile, isLoading } = useQuery({
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
  if (!profile) return <div>User not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <header className="bg-white dark:bg-slate-900 border-b sticky top-0 z-50 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-display font-bold text-xl">Professional Profile</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Profile Header */}
        <Card className="overflow-hidden border-none shadow-md">
          <div className="h-32 bg-gradient-to-r from-teal-500 to-indigo-600" />
          <CardContent className="relative pt-16">
            <div className="absolute -top-12 left-6">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center">
                  {profile.user.profileImageUrl ? (
                    <img 
                      src={profile.user.profileImageUrl} 
                      alt={profile.user.firstName} 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <User className="w-12 h-12 text-slate-400" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold font-display">
                    {profile.user.firstName} {profile.user.lastName}
                  </h2>
                  <Badge variant="secondary" className="bg-teal-50 text-teal-700 border-teal-200">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                <div className="flex items-center gap-1 mt-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold">4.8</span>
                  <span className="text-slate-400 text-sm font-normal">(24 reviews)</span>
                </div>
              </div>
              
              {!isOwnProfile && (
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Hire {profile.user.firstName}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Skills Section */}
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg font-display font-bold">Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {profile.skills.map((skill: any) => (
                      <motion.div
                        key={skill.id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                      >
                        <Badge variant="outline" className="px-3 py-1 text-sm rounded-full bg-slate-50 border-slate-200">
                          {skill.name}
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {isOwnProfile && (
                  <div className="flex gap-2 pt-2">
                    <Input 
                      placeholder="Add a skill (e.g. Welding)" 
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addSkillMutation.mutate(newSkill)}
                      className="h-9"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => addSkillMutation.mutate(newSkill)}
                      disabled={!newSkill || addSkillMutation.isPending}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Proof of Work */}
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-indigo-500" />
                  Proof of Work
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.portfolio.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {profile.portfolio.map((item: any) => (
                      <div key={item.id} className="group relative aspect-video rounded-xl overflow-hidden bg-slate-100">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <p className="text-white text-xs font-medium">{item.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border-2 border-dashed rounded-xl border-slate-200">
                    <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">No portfolio items added yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Work History */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-teal-500" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {profile.workExperience.length > 0 ? (
                  profile.workExperience.map((exp: any, i: number) => (
                    <div key={exp.id} className="relative pl-6 pb-6 last:pb-0 border-l-2 border-slate-100 last:border-transparent">
                      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-teal-500 border-4 border-white dark:border-slate-900 shadow-sm" />
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100">{exp.position}</h4>
                        <p className="text-sm font-medium text-teal-600">{exp.company}</p>
                        <p className="text-xs text-slate-400 mb-2">{exp.startDate} - {exp.endDate || 'Present'}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{exp.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm text-center py-4">No work history listed</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="border-none shadow-sm bg-indigo-50/50 dark:bg-indigo-900/20">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Job Completion</span>
                  <span className="text-lg font-bold">100%</span>
                </div>
                <div className="w-full bg-indigo-100 dark:bg-indigo-900 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '100%' }} />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                    <p className="text-2xl font-bold text-indigo-600">42</p>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Jobs Done</p>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                    <p className="text-2xl font-bold text-teal-500">2w</p>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Response</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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
