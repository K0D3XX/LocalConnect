import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type LocationData = {
  country: string;
  city: string;
  currency: string;
};

type LocationContextType = {
  location: LocationData | null;
  setLocation: (data: LocationData) => void;
  isLoaded: boolean;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<LocationData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("localconnect_location");
    if (saved) {
      try {
        setLocationState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved location", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const setLocation = (data: LocationData) => {
    setLocationState(data);
    localStorage.setItem("localconnect_location", JSON.stringify(data));
  };

  return (
    <LocationContext.Provider value={{ location, setLocation, isLoaded }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
