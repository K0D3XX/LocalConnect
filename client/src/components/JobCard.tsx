import { type Job } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Building2, Navigation } from "lucide-react";
import { differenceInHours } from "date-fns";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface JobCardProps {
  job: Job;
  onClick?: () => void;
  className?: string;
  selected?: boolean;
}

export function JobCard({ job, onClick, className, selected }: JobCardProps) {
  const isRecent = differenceInHours(new Date(), new Date(job.createdAt)) < 2;

  return (
    <Card 
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden transition-all duration-300 cursor-pointer border-none shadow-sm hover:shadow-md rounded-2xl",
        selected ? "ring-2 ring-primary bg-primary/5" : "bg-white dark:bg-slate-900",
        className
      )}
    >
      <CardContent className="p-5 flex flex-col h-full gap-4">
        {/* Header Section */}
        <div className="flex justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {job.title}
              </h3>
              {isRecent && (
                <Badge variant="default" className="bg-primary hover:bg-primary/90 text-white border-0 px-2 py-0.5 h-5 text-[10px] uppercase tracking-wider font-bold">
                  Hiring Now
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-medium">
              <Building2 className="w-3.5 h-3.5" />
              <span>{job.company}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 text-primary rounded-full">
            <span className="text-xs font-black tracking-tight">P{job.salary}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="secondary" className="font-bold text-[10px] uppercase tracking-widest bg-slate-100 dark:bg-slate-800">
            {job.category}
          </Badge>
          <Badge variant="outline" className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground border-slate-200">
            {job.type}
          </Badge>
        </div>

        {job.landmark && (
          <div className="flex items-center gap-2 py-1.5 px-3 bg-primary/10 rounded-xl border border-primary/20">
            <Navigation className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-black text-primary uppercase tracking-tight">
              {job.landmark}
            </span>
          </div>
        )}

        {/* 3-Point Bullet Summary */}
        <div className="space-y-2 py-2 border-y border-slate-50 dark:border-slate-800">
          <div className="flex items-start gap-2 text-sm">
            <span className="text-primary font-bold">📍 Location:</span>
            <span className="text-muted-foreground">{job.landmark || "Botswana"}</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <span className="text-primary font-bold">💰 Pay:</span>
            <span className="text-muted-foreground">P{job.salary} (Fixed)</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <span className="text-primary font-bold">🛠️ Must-Have:</span>
            <span className="text-muted-foreground line-clamp-1">{job.description}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-3">
          <Button 
            size="sm" 
            variant="outline"
            className="flex-1 h-9 rounded-full text-[10px] font-bold uppercase tracking-widest border-primary/20 text-primary hover:bg-primary/5" 
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `tel:${job.contactPhone}`;
            }}
          >
            <Phone className="w-3.5 h-3.5 mr-1.5" />
            Call for Details
          </Button>
          
          <Link href={`/checkout/${job.id}`}>
            <Button 
              size="sm" 
              className="h-9 rounded-full bg-primary hover:bg-primary/90 font-bold text-[10px] uppercase tracking-widest px-6 shadow-lg shadow-primary/20"
              onClick={(e) => e.stopPropagation()}
            >
              Apply & Pay
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
