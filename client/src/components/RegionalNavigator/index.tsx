import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { districts } from "./districtData";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Navigation } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export function RegionalNavigator() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState(districts[0]);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [selectedDistrict.coords[0], selectedDistrict.coords[1]],
      zoom: 9,
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  const handleDistrictChange = (name: string) => {
    const district = districts.find((d) => d.name === name);
    if (district && map.current) {
      setSelectedDistrict(district);
      map.current.flyTo({
        center: [district.coords[0], district.coords[1]],
        zoom: 10,
        duration: 2000,
      });
    }
  };

  const handleCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        map.current?.flyTo({
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 12,
          duration: 2000,
        });
      });
    }
  };

  return (
    <Card className="overflow-hidden border-none shadow-md bg-white dark:bg-slate-900">
      <CardContent className="p-0">
        <div className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between border-b bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <MapPin className="w-5 h-5 text-primary" />
            <Select onValueChange={handleDistrictChange} defaultValue={selectedDistrict.name}>
              <SelectTrigger className="w-full sm:w-[200px] h-9">
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((d) => (
                  <SelectItem key={d.name} value={d.name}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCurrentLocation}
            className="w-full sm:w-auto h-9 gap-2"
          >
            <Navigation className="w-4 h-4" />
            Current Location
          </Button>
        </div>

        <div className="relative h-[300px] sm:h-[400px]">
          <div ref={mapContainer} className="absolute inset-0" />
        </div>

        <div className="p-4 bg-primary/5 border-t">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg">{selectedDistrict.name} District</h3>
              <p className="text-sm text-muted-foreground">Botswana</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Population</p>
              <p className="text-xl font-display font-black text-primary">{selectedDistrict.population}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
