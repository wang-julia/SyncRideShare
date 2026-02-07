import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { MapPin, Briefcase, Calendar, Users, Home } from "lucide-react";
import { InteractiveMap } from "@/app/components/interactive-map";
import { AddressAutocomplete } from "@/app/components/address-autocomplete";
import { UserProfile } from "@/app/components/profile-creation";
import { projectId, publicAnonKey } from '/utils/supabase/info';
import "leaflet/dist/leaflet.css";

interface PreferencesFormProps {
  airport: string;
  userProfile: UserProfile;
  onSubmit: (preferences: UserPreferences) => void;
  onBack: () => void;
  onHome?: () => void;
}

export interface UserPreferences {
  pickupLocation: string;
  latitude: number;
  longitude: number;
  departureTime: string;
  baggageSize: "small" | "medium" | "large";
  genderPreference: "no-preference" | "male" | "female" | "non-binary";
}

export function PreferencesForm({ airport, userProfile, onSubmit, onBack, onHome }: PreferencesFormProps) {
  const [pickupLocation, setPickupLocation] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);
  const [departureTime, setDepartureTime] = useState("");
  const [baggageSize, setBaggageSize] = useState<"small" | "medium" | "large">("medium");
  const [genderPreference, setGenderPreference] = useState<UserPreferences["genderPreference"]>("no-preference");

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c63c7d45`;

  // Set default departure time to current date/time
  useEffect(() => {
    const now = new Date();
    // Format for datetime-local input: YYYY-MM-DDTHH:MM
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    setDepartureTime(formattedDateTime);
  }, []);

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setLatitude(lat);
    setLongitude(lng);
    setPickupLocation(address);
    setSelectedCoords([lat, lng]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use selected coordinates or fall back to mock coordinates
    const coordinates = {
      latitude: latitude ?? 40.7128 + Math.random() * 0.1,
      longitude: longitude ?? -74.0060 + Math.random() * 0.1,
    };

    const preferences: UserPreferences = {
      pickupLocation,
      ...coordinates,
      departureTime,
      baggageSize,
      genderPreference,
    };

    // Save the ride request to the database (commented out until backend is ready)
    // In a production app, this would save to the backend
    /*
    try {
      const rideRequest = {
        userId: userProfile.id,
        userName: userProfile.name,
        userGender: userProfile.gender,
        airport,
        ...preferences,
      };

      const response = await fetch(`${API_URL}/ride-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(rideRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }

      const data = await response.json();
      if (data.success) {
        console.log('Ride request saved:', data.request);
      } else {
        console.error('Failed to save ride request:', data.error);
      }
    } catch (error) {
      console.error('Error saving ride request:', error);
    }
    */

    // Continue to matches screen
    onSubmit(preferences);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto pt-4">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onBack} className="-ml-2">
            ← Back
          </Button>
          {onHome && (
            <Button variant="ghost" onClick={onHome}>
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-2xl mb-2">Ride Details</h2>
          <p className="text-gray-600">Going to {airport}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pickup Location Card - Map and Address */}
          <Card className="p-4">
            <Label className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4" style={{ color: '#4a85c8' }} />
              Select Preferred Pickup Location on Map
            </Label>
            <InteractiveMap
              onLocationSelect={handleLocationSelect}
              selectedLocation={selectedCoords}
            />
            
            <div className="mt-4">
              <Label htmlFor="pickup" className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4" style={{ color: '#4a85c8' }} />
                Pickup Address
              </Label>
              <AddressAutocomplete
                value={pickupLocation}
                onChange={setPickupLocation}
                onSelectLocation={handleLocationSelect}
                placeholder="Start typing your address..."
                required
              />
              {latitude && longitude && (
                <p className="text-xs text-gray-500 mt-2">
                  📍 Location selected on map
                </p>
              )}
            </div>
          </Card>

          {/* Departure Time Card */}
          <Card className="p-4">
            <Label htmlFor="time" className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4" style={{ color: '#4a85c8' }} />
              Departure Time
            </Label>
            <Input
              id="time"
              type="datetime-local"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              required
            />
          </Card>

          {/* Baggage Size Card */}
          <Card className="p-4">
            <Label className="flex items-center gap-2 mb-3">
              <Briefcase className="w-4 h-4" style={{ color: '#4a85c8' }} />
              Baggage Size
            </Label>
            <RadioGroup value={baggageSize} onValueChange={(value) => setBaggageSize(value as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="small" />
                <Label htmlFor="small" className="cursor-pointer">Small (backpack)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="cursor-pointer">Medium (carry-on)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="large" />
                <Label htmlFor="large" className="cursor-pointer">Large (checked bag)</Label>
              </div>
            </RadioGroup>
          </Card>

          {/* Gender Preference Card */}
          <Card className="p-4">
            <Label className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4" style={{ color: '#4a85c8' }} />
              Gender Preference for Ride Partner
            </Label>
            <Select value={genderPreference} onValueChange={(value) => setGenderPreference(value as UserPreferences["genderPreference"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-preference">No Preference</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
              </SelectContent>
            </Select>
          </Card>

          <Button type="submit" className="w-full hover:bg-opacity-90" style={{ backgroundColor: '#4a85c8' }}>
            Find Matches
          </Button>
        </form>
      </div>
    </div>
  );
}