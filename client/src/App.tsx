import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocationProvider, useLocation } from "@/hooks/use-location";
import Dashboard from "@/pages/Dashboard";
import Onboarding from "@/pages/Onboarding";
import Profile from "@/pages/Profile";
import Checkout from "@/pages/Checkout";
import NotFound from "@/pages/not-found";

function Router() {
  const { location, isLoaded } = useLocation();

  if (!isLoaded) return null;

  return (
    <Switch>
      <Route path="/profile/:userId" component={Profile} />
      <Route path="/checkout/:jobId" component={Checkout} />
      <Route path="/">
        {location ? <Dashboard /> : <Onboarding />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LocationProvider>
          <Toaster />
          <Router />
        </LocationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
