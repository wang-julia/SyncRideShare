import { useEffect, useRef, useState } from "react";
import L from "leaflet";

interface InteractiveMapProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialCenter?: [number, number];
  selectedLocation?: [number, number] | null;
}

export function InteractiveMap({ 
  onLocationSelect, 
  initialCenter = [40.8075, -73.9626], // Default to Columbia University area
  selectedLocation 
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Wait for next tick to ensure DOM is ready
    const timer = setTimeout(() => {
      if (!mapRef.current) return;

      try {
        // Initialize the map
        const map = L.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
        }).setView(initialCenter, 15);

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // Fix default marker icon issue
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        });

        // Handle map clicks
        map.on("click", async (e) => {
          const { lat, lng } = e.latlng;
          
          // Remove existing marker if any
          if (markerRef.current) {
            markerRef.current.remove();
          }

          // Add new marker
          const marker = L.marker([lat, lng]).addTo(map);
          markerRef.current = marker;

          // Reverse geocode to get address (using Nominatim API)
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            
            marker.bindPopup(address).openPopup();
            onLocationSelect(lat, lng, address);
          } catch (error) {
            const address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            marker.bindPopup(address).openPopup();
            onLocationSelect(lat, lng, address);
          }
        });

        mapInstanceRef.current = map;
        
        // Invalidate size after a short delay to ensure proper rendering
        setTimeout(() => {
          map.invalidateSize();
          setIsMapReady(true);
        }, 100);
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }, 50);

    // Cleanup
    return () => {
      clearTimeout(timer);
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off();
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      setIsMapReady(false);
    };
  }, []);

  // Update marker when selectedLocation prop changes
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    if (selectedLocation) {
      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Add marker at selected location
      const marker = L.marker(selectedLocation).addTo(mapInstanceRef.current);
      markerRef.current = marker;
      
      // Pan to the location
      mapInstanceRef.current.setView(selectedLocation, 15);
    }
  }, [selectedLocation, isMapReady]);

  return (
    <div className="relative">
      <div ref={mapRef} style={{ height: "300px", width: "100%" }} className="rounded-lg" />
      <div className="absolute top-2 left-2 bg-white px-3 py-2 rounded-lg shadow-md text-sm z-[1000]">
        <p className="text-gray-600">📍 Click on the map to select pickup location</p>
      </div>
    </div>
  );
}