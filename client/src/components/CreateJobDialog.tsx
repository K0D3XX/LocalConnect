import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateJob } from "@/hooks/use-jobs";
import { insertJobSchema, type InsertJob } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const categories = ["Retail", "Food Service", "Labor", "Office", "Healthcare", "Technology", "Other"];
const types = ["Full-time", "Part-time", "Contract", "Gig"];

export function CreateJobDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const createJob = useCreateJob();

  // Extend schema to coerce numbers for lat/lng
  const formSchema = insertJobSchema.extend({
    // lat/lng are technically doublePrecision in schema but input type="number" returns string
    lat: insertJobSchema.shape.lat, 
    lng: insertJobSchema.shape.lng,
  });

  const form = useForm<InsertJob>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      company: "",
      description: "",
      category: "Retail",
      type: "Full-time",
      salary: "",
      contactPhone: "",
      lat: 37.7749, // Default to SF for demo
      lng: -122.4194,
    },
  });

  function onSubmit(data: InsertJob) {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to post a job.",
        variant: "destructive",
      });
      return;
    }

    createJob.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        toast({
          title: "Job Posted!",
          description: "Your listing is now live on the map.",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Post a Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold text-primary">Post a New Opportunity</DialogTitle>
          <DialogDescription>
            Share a job with your local community.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Barista" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Blue Bottle Coffee" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {types.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary / Rate (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. $20/hr or $60k/yr" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="p-4 bg-muted/50 rounded-lg border border-border/50 space-y-4">
              <h4 className="font-semibold text-sm">Location Coordinates</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="lat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Latitude</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="any" 
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lng"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Longitude</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="any" 
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Tip: You can get these from Google Maps by right-clicking a location.
              </p>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the role, requirements, and benefits..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createJob.isPending}>
                {createJob.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Create Listing"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
