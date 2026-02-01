import { useState, useRef, useEffect } from "react";
import { useJobs } from "@/hooks/use-jobs";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "@/hooks/use-location";
import { JobCard } from "@/components/JobCard";
import { MapView } from "@/components/MapView";
import { CreateJobDialog } from "@/components/CreateJobDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Map as MapIcon, LogOut, UserCircle } from "lucide-react";

export default function Dashboard() {
  const { data: jobs, isLoading } = useJobs();
  const { user, logout } = useAuth();
  const { location } = useLocation();
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"map" | "list">("map"); // Mobile toggle
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

  const filteredJobs = jobs?.filter(job => 
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase()) ||
    job.category.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="flex-none h-16 border-b border-border bg-white/80 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between z-50 shadow-sm relative">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <MapIcon className="w-5 h-5 text-primary" />
          </div>
          <h1 className="font-display font-bold text-xl tracking-tight hidden sm:block">
            LocalConnect: <span className="text-primary">{location?.city || "Exploring"}</span>
          </h1>
        </div>

        <div className="flex-1 max-w-md mx-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              className="pl-9 bg-muted/30 border-transparent focus:bg-background focus:border-primary/20 transition-all rounded-full" 
              placeholder="Search jobs, companies, categories..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
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

      {/* Main Layout - Split Screen */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Mobile View Toggle */}
        <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex gap-2 bg-white/90 backdrop-blur p-1 rounded-full shadow-lg border border-border">
          <Button 
            variant={activeTab === "map" ? "default" : "ghost"} 
            size="sm" 
            className="rounded-full px-6"
            onClick={() => setActiveTab("map")}
          >
            Map
          </Button>
          <Button 
            variant={activeTab === "list" ? "default" : "ghost"} 
            size="sm" 
            className="rounded-full px-6"
            onClick={() => setActiveTab("list")}
          >
            List
          </Button>
        </div>

        {/* Map Panel (Left/Top) */}
        <div className={`
          w-full h-full md:w-[60%] lg:w-[65%] xl:w-[70%] relative transition-all duration-300
          ${activeTab === "list" ? "hidden md:block" : "block"}
        `}>
          {isLoading ? (
             <div className="w-full h-full bg-muted/20 animate-pulse flex items-center justify-center">
               <span className="text-muted-foreground font-medium">Loading Map...</span>
             </div>
          ) : (
            <MapView 
              jobs={filteredJobs} 
              selectedJobId={selectedJobId} 
              onSelectJob={(id) => {
                setSelectedJobId(id);
                setActiveTab("list"); // On mobile switch to list to see details
              }} 
            />
          )}
        </div>

        {/* List Panel (Right/Bottom) */}
        <div 
          ref={listRef}
          className={`
            w-full md:w-[40%] lg:w-[35%] xl:w-[30%] bg-background border-l border-border flex flex-col
            ${activeTab === "map" ? "hidden md:flex" : "flex h-full"}
          `}
        >
          <div className="p-4 border-b border-border bg-white/50 backdrop-blur flex justify-between items-center sticky top-0 z-10">
            <div>
              <h2 className="font-display font-bold text-lg">Opportunities</h2>
              <p className="text-xs text-muted-foreground">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found nearby
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-3 p-4 border rounded-xl">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">No jobs found</h3>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your search criteria</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div id={`job-card-${job.id}`} key={job.id}>
                  <JobCard 
                    job={job} 
                    selected={selectedJobId === job.id}
                    onClick={() => {
                      setSelectedJobId(job.id);
                      if (window.innerWidth < 768) {
                        // On mobile, maybe show a sheet? For now, we just select it
                        // Could auto-switch to map if we wanted
                      }
                    }}
                  />
                </div>
              ))
            )}
            
            {/* Bottom spacer for mobile FAB */}
            <div className="h-20 md:hidden" />
          </div>
        </div>
      </main>
    </div>
  );
}
