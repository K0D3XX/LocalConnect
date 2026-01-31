import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { type Job } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Phone, MapPin } from "lucide-react";

// Fix Leaflet default icon issue in React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  jobs: Job[];
  selectedJobId: number | null;
  onSelectJob: (id: number) => void;
}

// Component to handle map movement when selection changes
function MapUpdater({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

export function MapView({ jobs, selectedJobId, onSelectJob }: MapViewProps) {
  const selectedJob = jobs.find(j => j.id === selectedJobId);
  const center: [number, number] = selectedJob 
    ? [selectedJob.lat, selectedJob.lng] 
    : [37.7749, -122.4194]; // Default SF

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater center={selectedJob ? [selectedJob.lat, selectedJob.lng] : null} />

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
      
      {/* Overlay gradient for style */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white/80 to-transparent pointer-events-none z-[400] md:hidden" />
    </div>
  );
}
