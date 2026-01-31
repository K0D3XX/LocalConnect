import { useState } from "react";
import { useLocation } from "@/hooks/use-location";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MapPin, ArrowRight, Globe, Coins } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Onboarding() {
  const { setLocation } = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    country: "",
    city: "",
    currency: "",
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      setLocation(formData as any);
    }
  };

  const isNextDisabled = () => {
    if (step === 1) return !formData.country;
    if (step === 2) return !formData.city;
    if (step === 3) return !formData.currency;
    return false;
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/5 p-4">
      <Card className="w-full max-w-lg border-none shadow-2xl overflow-hidden bg-background/80 backdrop-blur-xl">
        <div className="h-2 bg-muted overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: "33.33%" }}
            animate={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
        
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-display font-bold">Welcome to LocalConnect</CardTitle>
          <CardDescription className="text-base">Let's personalize your job search experience</CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <Globe className="w-5 h-5" />
                    <Label className="text-lg">Target Country</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Which country are you looking for work in?</p>
                  <Select 
                    value={formData.country} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, country: v }))}
                  >
                    <SelectTrigger className="h-12 text-lg">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Botswana">Botswana</SelectItem>
                      <SelectItem value="South Africa">South Africa</SelectItem>
                      <SelectItem value="Namibia">Namibia</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <MapPin className="w-5 h-5" />
                    <Label className="text-lg">City or Region</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Where specifically are you searching?</p>
                  <Input 
                    className="h-12 text-lg" 
                    placeholder="e.g. Gaborone, Johannesburg..."
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    autoFocus
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <Coins className="w-5 h-5" />
                    <Label className="text-lg">Preferred Currency</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">How should we display salary information?</p>
                  <Select 
                    value={formData.currency} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, currency: v }))}
                  >
                    <SelectTrigger className="h-12 text-lg">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BWP">BWP (Pula)</SelectItem>
                      <SelectItem value="ZAR">ZAR (Rand)</SelectItem>
                      <SelectItem value="USD">USD (Dollar)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <Button 
            className="w-full h-12 text-lg font-bold mt-10 rounded-xl"
            disabled={isNextDisabled()}
            onClick={handleNext}
          >
            {step === 3 ? "Start Exploring" : "Next Step"}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
