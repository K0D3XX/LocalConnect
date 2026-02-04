import { useState, useRef, useEffect } from "react";
import { useJobs } from "@/hooks/use-jobs";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "@/hooks/use-location";
import { JobCard } from "@/components/JobCard";
import { CreateJobDialog } from "@/components/CreateJobDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Map as MapIcon, LogOut, UserCircle, MapPin, ShieldCheck, Users, Briefcase } from "lucide-react";
import { Link } from "wouter";
import { RegionalNavigator } from "@/components/RegionalNavigator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { data: jobs, isLoading } = useJobs();
  const { user, logout } = useAuth();
  const { location } = useLocation();
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"map" | "list">("map"); // Mobile toggle
  const [userMode, setUserMode] = useState<'Hiring' | 'Working'>('Working');
  const listRef = useRef<HTMLDivElement>(null);

  // Scroll to selected job in list
  useEffect(() => {
    if (selectedJobId && listRef.current) {
      const el = document.getElementById(`job-card-${selectedJobId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedJobId]);

  const filteredJobs = jobs?.filter((job: any) => 
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase()) ||
    job.category.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="flex-none h-16 border-b border-border bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between z-50 shadow-sm sticky top-0">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <MapIcon className="w-5 h-5 text-primary" />
          </div>
          <h1 className="font-display font-bold text-xl tracking-tight hidden sm:block">
            LocalConnect
          </h1>
        </div>

        <div className="flex-1 max-w-md mx-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              className="pl-9 bg-muted/30 border-transparent focus:bg-background focus:border-primary/20 transition-all rounded-full" 
              placeholder="Search local gigs..." 
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Toggle */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setUserMode('Working')}
              className={cn(
                "h-8 rounded-lg px-3 transition-all duration-300 gap-2",
                userMode === 'Working' 
                  ? "bg-white dark:bg-slate-700 shadow-sm text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span className="text-xs font-bold uppercase tracking-tight">Working</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setUserMode('Hiring')}
              className={cn(
                "h-8 rounded-lg px-3 transition-all duration-300 gap-2",
                userMode === 'Hiring' 
                  ? "bg-white dark:bg-slate-700 shadow-sm text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Users className="w-3.5 h-3.5" />
              <span className="text-xs font-bold uppercase tracking-tight">Hiring</span>
            </Button>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <CreateJobDialog />
              <div className="hidden md:flex items-center gap-2 text-sm font-medium pl-3 border-l border-border/50">
                <Link href={`/profile/${user.id}`}>
                  <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-muted rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCircle className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-muted-foreground font-semibold">Hi, {user.firstName || 'User'}</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => logout()} title="Logout">
                  <LogOut className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            </div>
          ) : (
             <Button variant="ghost" onClick={() => window.location.href = "/api/login"}>
               <UserCircle className="w-4 h-4 mr-2" />
               Log In
             </Button>
          )}
        </div>
      </header>

      {/* Main Layout - Redesigned with Regional Navigator */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Navigator & Filters (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <RegionalNavigator />
            
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="pb-3 bg-slate-50/50 dark:bg-slate-800/50">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Popular Service Areas
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 p-4">
                {['Gaborone', 'Central', 'North-East', 'Kweneng'].map(area => (
                  <Button key={area} variant="outline" size="sm" className="justify-start font-normal h-8 rounded-full">
                    {area}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="pb-3 bg-slate-50/50 dark:bg-slate-800/50">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-500" />
                  Verified Experts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">P</div>
                  <div>
                    <p className="text-sm font-bold">Pule M.</p>
                    <Badge variant="secondary" className="text-[10px] px-1 h-4 bg-teal-50 text-teal-700 border-teal-200">Plumber</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">T</div>
                  <div>
                    <p className="text-sm font-bold">Thabo K.</p>
                    <Badge variant="secondary" className="text-[10px] px-1 h-4 bg-amber-50 text-amber-700 border-amber-200">Electrician</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Recommendations (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  {userMode === 'Working' ? 'Recommended Gigs' : 'Available Talent'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {userMode === 'Working' 
                    ? `Top opportunities in ${location?.city || "your area"}`
                    : `Skilled people ready to work in ${location?.city || "your area"}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary border-none">Trending</Badge>
                <Badge variant="outline" className="rounded-full">Nearby</Badge>
              </div>
            </div>

            {userMode === 'Hiring' ? (
              <Card className="border-dashed border-2 py-20 text-center bg-white/50 dark:bg-slate-900/50">
                <CardContent className="flex flex-col items-center justify-center space-y-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Talent Map Coming Soon</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                      We're currently verifying local professionals in {location?.city || "Botswana"}. 
                      Switch back to 'Working' to browse active jobs.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-2xl" />
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <Card className="border-dashed border-2 py-20 text-center">
                <CardContent>
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-bold">No gigs found</h3>
                  <p className="text-sm text-muted-foreground">Try a different district or search term</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredJobs.map((job: any) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    onClick={() => setSelectedJobId(job.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
