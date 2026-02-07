import { useEffect, useRef, useState } from "react";
import L from "leaflet";

interface SharedPickupMapProps {
  suggestedLocation: [number, number];
  onLocationChange: (location: [number, number], address: string) => void;
  isLocked?: boolean;
}

export function SharedPickupMap({ suggestedLocation, onLocationChange, isLocked }: SharedPickupMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>("Loading...");
  const [isMapReady, setIsMapReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Reverse geocode to get address
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setCurrentAddress(address);
      return address;
    } catch (error) {
      const fallbackAddress = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setCurrentAddress(fallbackAddress);
      return fallbackAddress;
    }
  };

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
        }).setView(suggestedLocation, 15);

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

        // Create a custom icon for the suggested pickup location
        const customIcon = L.divIcon({
          className: 'custom-pickup-marker',
          html: `
            <div style="
              background-color: #2563eb;
              width: 32px;
              height: 32px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" style="transform: rotate(45deg);">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        // Add draggable marker
        const marker = L.marker(suggestedLocation, {
          draggable: true,
          icon: customIcon,
        }).addTo(map);

        marker.bindPopup("Suggested Pickup Location (Drag to adjust)").openPopup();

        // Handle marker drag start
        marker.on("dragstart", () => {
          setIsDragging(true);
        });

        // Handle marker drag end
        marker.on("dragend", async () => {
          const position = marker.getLatLng();
          const newLocation: [number, number] = [position.lat, position.lng];
          const address = await reverseGeocode(position.lat, position.lng);
          setIsDragging(false);
          onLocationChange(newLocation, address);
        });

        markerRef.current = marker;
        mapInstanceRef.current = map;

        // Initial geocode
        reverseGeocode(suggestedLocation[0], suggestedLocation[1]);

        // Invalidate size after a short delay to ensure proper rendering
        setTimeout(() => {
          map.invalidateSize();
          setIsMapReady(true);
        }, 100);
      } catch (error) {
        console.error("Error initializing shared pickup map:", error);
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

  // Update marker position when suggestedLocation changes
  useEffect(() => {
    // Don't update if user is actively dragging
    if (isDragging || !markerRef.current || !mapInstanceRef.current || !isMapReady) return;
    
    markerRef.current.setLatLng(suggestedLocation);
    mapInstanceRef.current.setView(suggestedLocation, mapInstanceRef.current.getZoom());
    reverseGeocode(suggestedLocation[0], suggestedLocation[1]);
  }, [suggestedLocation, isMapReady, isDragging]);

  // Handle locked state changes
  useEffect(() => {
    if (!markerRef.current || !isMapReady) return;
    
    if (isLocked) {
      markerRef.current.dragging?.disable();
      markerRef.current.setOpacity(0.7);
    } else {
      markerRef.current.dragging?.enable();
      markerRef.current.setOpacity(1);
    }
  }, [isLocked, isMapReady]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[1000]">
        <div className="text-xs text-gray-500 mb-1">Suggested Pickup Location</div>
        <div className="text-sm">{currentAddress}</div>
        {!isLocked && (
          <div className="text-xs text-gray-400 mt-1">💡 Drag the pin to adjust location</div>
        )}
        {isLocked && (
          <div className="text-xs text-green-600 mt-1">✓ Location locked after confirmation</div>
        )}
      </div>
    </div>
  );
}