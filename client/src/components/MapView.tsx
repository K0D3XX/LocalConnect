import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { type Job } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useLocation } from "@/hooks/use-location";

// Fix Leaflet default icon issue in React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  jobs: Job[];
  selectedJobId: number | null;
  onSelectJob: (id: number) => void;
}

// Simple coordinate mapping for common cities to support flyTo
const CITY_COORDINATES: Record<string, [number, number]> = {
  "Gaborone": [-24.6282, 25.9231],
  "Johannesburg": [-26.2041, 28.0473],
  "Windhoek": [-22.5609, 17.0658],
  "Cape Town": [-33.9249, 18.4241],
};

function MapUpdater({ selectedJob, onboardingLocation }: { 
  selectedJob: Job | undefined; 
  onboardingLocation: { city: string } | null 
}) {
  const map = useMap();
  const [hasFlownToOnboarding, setHasFlownToOnboarding] = useState(false);

  useEffect(() => {
    if (onboardingLocation && !hasFlownToOnboarding) {
      const coords = CITY_COORDINATES[onboardingLocation.city] || [-24.6282, 25.9231]; // Default to Gaborone if unknown
      map.flyTo(coords, 12, { duration: 3 });
      setHasFlownToOnboarding(true);
    }
  }, [onboardingLocation, map, hasFlownToOnboarding]);

  useEffect(() => {
    if (selectedJob) {
      map.flyTo([selectedJob.lat, selectedJob.lng], 14, { duration: 1.5 });
    }
  }, [selectedJob, map]);

  return null;
}

export function MapView({ jobs, selectedJobId, onSelectJob }: MapViewProps) {
  const { location } = useLocation();
  const selectedJob = jobs.find(j => j.id === selectedJobId);
  
  // Start from a world view
  const initialCenter: [number, number] = [0, 20];
  const initialZoom = 2;

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater 
          selectedJob={selectedJob} 
          onboardingLocation={location}
        />

        {jobs.map((job) => (
          <Marker
            key={job.id}
            position={[job.lat, job.lng]}
            eventHandlers={{
              click: () => onSelectJob(job.id),
            }}
          >
            <Popup className="min-w-[200px]">
              <div className="p-3">
                <h4 className="font-display font-bold text-base mb-1">{job.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{job.company}</p>
                <Button 
                  size="sm" 
                  className="w-full h-8 text-xs"
                  onClick={() => window.location.href = `tel:${job.contactPhone}`}
                >
                  <Phone className="w-3 h-3 mr-2" />
                  Call Now
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white/80 to-transparent pointer-events-none z-[400] md:hidden" />
    </div>
  );
}
