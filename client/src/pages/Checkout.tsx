import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Smartphone, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { jobId } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [phone, setPhone] = useState("+267");
  const [step, setStep] = useState<"input" | "waiting" | "success">("input");

  const { data: job } = useQuery<any>({
    queryKey: [`/api/jobs/${jobId}`],
  });

  const payMutation = useMutation({
    mutationFn: async () => {
      // Simulate API call
      await new Promise(r => setTimeout(r, 1000));
      return { success: true };
    },
    onSuccess: () => {
      setStep("waiting");
      setTimeout(() => {
        setStep("success");
        toast({
          title: "Payment Received",
          description: `P${job?.salary} sent to Orange Money`,
        });
      }, 3000);
    },
  });

  if (!job) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="p-4 border-b bg-white dark:bg-slate-900 sticky top-0 z-50">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display font-bold text-xl">Secure Checkout</h1>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full p-4 space-y-6">
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-primary/70">Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-primary">P{job.salary}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <h2 className="font-bold text-lg px-2">Payment Method</h2>
              <Card className="border-2 border-primary bg-primary/5">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center overflow-hidden">
                    <div className="w-8 h-8 bg-[#FF7900] rounded-md" />
                  </div>
                  <div>
                    <p className="font-bold">Orange Money</p>
                    <p className="text-xs text-muted-foreground">Pay using your mobile wallet</p>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2">
                  Orange Money Number
                </label>
                <div className="flex gap-2">
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+267 7X XXX XXX"
                    className="h-12 rounded-2xl text-lg font-bold"
                  />
                </div>
              </div>

              <Button 
                className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                onClick={() => payMutation.mutate()}
                disabled={payMutation.isPending}
              >
                {payMutation.isPending ? <Loader2 className="animate-spin" /> : `Pay P${job.salary}`}
              </Button>
            </motion.div>
          )}

          {step === "waiting" && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center space-y-6"
            >
              <div className="relative mx-auto w-24 h-24">
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-primary/20"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Smartphone className="w-10 h-10 text-primary animate-bounce" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold">Waiting for USSD Prompt</h2>
                <p className="text-sm text-muted-foreground px-8">
                  Check your phone for the Orange Money USSD prompt and enter your PIN to authorize the payment.
                </p>
              </div>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center space-y-6"
            >
              <div className="w-24 h-24 bg-teal-500 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-teal-500/20">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                >
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </motion.div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black">Payment Successful</h2>
                <p className="text-sm text-muted-foreground">
                  Transaction ID: OM-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                </p>
              </div>
              <Button 
                variant="outline" 
                className="rounded-full px-8 h-12 font-bold"
                onClick={() => setLocation("/")}
              >
                Return to Dashboard
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
