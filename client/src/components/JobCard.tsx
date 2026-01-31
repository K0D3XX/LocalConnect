import { type Job } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, DollarSign, Clock, Building2 } from "lucide-react";
import { differenceInHours } from "date-fns";
import { cn } from "@/lib/utils";

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
        "group relative overflow-hidden transition-all duration-300 cursor-pointer border hover:border-primary/50",
        selected ? "ring-2 ring-primary border-primary shadow-lg shadow-primary/10 bg-primary/5" : "hover:shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      <div className="p-5 flex flex-col h-full gap-4">
        {/* Header Section */}
        <div className="flex justify-between items-start gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {job.title}
              </h3>
              {isRecent && (
                <Badge variant="default" className="bg-accent hover:bg-accent/90 text-white border-0 shadow-sm animate-pulse px-2 py-0.5 h-5 text-[10px] uppercase tracking-wider font-bold">
                  Hiring Now
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-medium">
              <Building2 className="w-3.5 h-3.5" />
              <span>{job.company}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="secondary" className="font-normal text-secondary-foreground bg-secondary/50">
            {job.category}
          </Badge>
          <Badge variant="outline" className="font-normal text-muted-foreground">
            {job.type}
          </Badge>
          {job.salary && (
            <div className="flex items-center gap-1 text-muted-foreground px-2 py-0.5 rounded-full bg-muted/50 border border-border/50">
              <DollarSign className="w-3 h-3" />
              <span>{job.salary}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Footer Actions */}
        <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
             <MapPin className="w-3.5 h-3.5 text-primary" />
             <span>View on Map</span>
          </div>

          <Button 
            size="sm" 
            className="w-auto shadow-sm" 
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `tel:${job.contactPhone}`;
            }}
          >
            <Phone className="w-3.5 h-3.5 mr-2" />
            Call Employer
          </Button>
        </div>
      </div>
    </Card>
  );
}
