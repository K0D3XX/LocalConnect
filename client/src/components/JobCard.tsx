import { type Job } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Building2 } from "lucide-react";
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

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed italic">
          "{job.description}"
        </p>

        {/* Footer Actions */}
        <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
             <MapPin className="w-3.5 h-3.5 text-primary" />
             <span>Botswana</span>
          </div>

          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="ghost"
              className="h-8 rounded-full text-[10px] font-bold uppercase tracking-widest" 
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `tel:${job.contactPhone}`;
              }}
            >
              <Phone className="w-3 h-3 mr-1.5" />
              Call
            </Button>
            <Link href={`/checkout/${job.id}`}>
              <Button 
                size="sm" 
                className="h-8 rounded-full bg-primary hover:bg-primary/90 font-bold text-[10px] uppercase tracking-widest px-4 shadow-lg shadow-primary/20"
                onClick={(e) => e.stopPropagation()}
              >
                Apply & Pay
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
