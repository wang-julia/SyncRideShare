import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { MapPin, Clock, DollarSign, Briefcase, MessageCircle, Check, Home } from "lucide-react";
import { UserPreferences } from "./preferences-form";
import { UserProfile } from "@/app/components/profile-creation";
import { projectId, publicAnonKey } from '/utils/supabase/info';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import { useState, useEffect } from "react";

interface Match {
  id: string;
  name: string;
  initials: string;
  gender: string;
  pickupLocation: string;
  departureTime: string;
  baggageSize: string;
  estimatedCost: number;
  matchScore: number;
  distance: string;
  latitude: number;
  longitude: number;
}

interface MatchResultsProps {
  airport: string;
  preferences: UserPreferences;
  userProfile: UserProfile;
  onSelectMatch: (match: Match) => void;
  onBack: () => void;
  onHome?: () => void;
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

export function MatchResults({ airport, preferences, userProfile, onSelectMatch, onBack, onHome }: MatchResultsProps) {
  const [confirmingMatch, setConfirmingMatch] = useState<Match | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c63c7d45`;

  // Generate mock matches (will fetch from backend when ready)
  useEffect(() => {
    const generateMockMatches = () => {
      setLoading(true);
      
      // Mock data for demonstration
      const mockUsers = [
        { name: "Emma Rodriguez", gender: "female", pickupLocation: "John Jay Hall", latitude: 40.8075, longitude: -73.9626 },
        { name: "James Anderson", gender: "male", pickupLocation: "Wien Hall", latitude: 40.8055, longitude: -73.9635 },
        { name: "Sofia Martinez", gender: "female", pickupLocation: "Carman Hall", latitude: 40.8065, longitude: -73.9615 },
        { name: "Alex Chen", gender: "non-binary", pickupLocation: "Furnald Hall", latitude: 40.8070, longitude: -73.9640 },
        { name: "Michael Thompson", gender: "male", pickupLocation: "Broadway Residence Hall", latitude: 40.8080, longitude: -73.9620 },
      ];

      const processedMatches = mockUsers
        .filter(user => {
          // Filter by gender preference
          if (preferences.genderPreference !== "no-preference") {
            return user.gender === preferences.genderPreference;
          }
          return true;
        })
        .map(user => {
          const distance = calculateDistance(
            preferences.latitude,
            preferences.longitude,
            user.latitude,
            user.longitude
          );
          
          // Generate a random time offset within 2 hours
          const userTime = new Date(preferences.departureTime).getTime();
          const randomOffset = (Math.random() - 0.5) * 2 * 60 * 60 * 1000; // +/- 1 hour
          const matchTime = new Date(userTime + randomOffset);
          const timeDiffMinutes = Math.abs(userTime - matchTime.getTime()) / 60000;
          
          // Calculate match score based on distance and time proximity
          const distanceScore = Math.max(0, 50 - (distance * 50));
          const timeScore = Math.max(0, 50 - (timeDiffMinutes / 15 * 50));
          const matchScore = Math.round(distanceScore + timeScore);

          // Calculate estimated cost
          const estimatedCost = Math.round(25 + Math.random() * 10);

          // Get initials from name
          const nameParts = user.name.split(' ');
          const initials = nameParts.map(part => part[0]).join('');

          // Random baggage size
          const baggageSizes = ["Small", "Medium", "Large"];
          const baggageSize = baggageSizes[Math.floor(Math.random() * baggageSizes.length)];

          return {
            id: `user_${user.name.replace(/\s/g, '_').toLowerCase()}`,
            name: user.name,
            initials: initials,
            gender: user.gender,
            pickupLocation: user.pickupLocation,
            departureTime: matchTime.toLocaleString(),
            baggageSize: baggageSize,
            estimatedCost,
            matchScore,
            distance: `${distance.toFixed(1)} mi away`,
            latitude: user.latitude,
            longitude: user.longitude,
          };
        })
        .sort((a, b) => b.matchScore - a.matchScore);

      setMatches(processedMatches);
      setLoading(false);
    };

    generateMockMatches();
  }, [airport, preferences, userProfile.id]);

  const handleMatchClick = (match: Match) => {
    setConfirmingMatch(match);
  };

  const handleConfirmMatch = () => {
    if (confirmingMatch) {
      onSelectMatch(confirmingMatch);
      setConfirmingMatch(null);
    }
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
          <h2 className="text-2xl mb-2">Your Matches</h2>
          <p className="text-gray-600">Going to {airport}</p>
          <p className="text-sm text-gray-500">Found {matches.length} potential matches</p>
        </div>

        <div className="space-y-4">
          {loading ? (
            <Card className="p-6 text-center">
              <p className="text-gray-600">Searching for matches...</p>
            </Card>
          ) : matches.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray-600 mb-2">No matches found yet</p>
              <p className="text-sm text-gray-500">
                Try adjusting your preferences or check back later when more students post their trips.
              </p>
            </Card>
          ) : (
            matches.map((match) => (
              <Card key={match.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 ring-2 ring-offset-2 ring-[#4a85c8]">
                      <AvatarFallback style={{ backgroundColor: '#4a85c8' }} className="text-white">
                        {match.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-lg">{match.name}</div>
                      <div className="text-sm text-gray-500">{match.distance}</div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {match.matchScore}% match
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{match.pickupLocation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{match.departureTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>{match.baggageSize} baggage</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">${match.estimatedCost} per person</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleMatchClick(match)}
                  className="w-full hover:bg-opacity-90"
                  style={{ backgroundColor: '#4a85c8' }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Connect with {match.name.split(' ')[0]}
                </Button>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmingMatch} onOpenChange={(open) => !open && setConfirmingMatch(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4" style={{ backgroundColor: '#d6e8f7' }}>
              <Check className="w-8 h-8" style={{ color: '#4a85c8' }} />
            </div>
            <AlertDialogTitle className="text-center text-xl">
              Connect with {confirmingMatch?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              You're about to start a conversation with {confirmingMatch?.name} to coordinate your ride to {airport}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {/* Details section outside of AlertDialogDescription */}
          <div className="rounded-lg p-4 space-y-3 text-sm" style={{ backgroundColor: '#e8f1fa' }}>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#4a85c8' }} />
              <div className="flex-1">
                <div className="text-gray-600">Pickup Location</div>
                <div className="text-gray-900">{confirmingMatch?.pickupLocation}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <DollarSign className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-gray-600">Estimated Cost</div>
                <div className="text-green-600">${confirmingMatch?.estimatedCost} per person</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge className="bg-green-100 text-green-800 border-0">
                {confirmingMatch?.matchScore}% compatible
              </Badge>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            You'll be able to chat, share location, and finalize ride details.
          </div>

          <AlertDialogFooter className="flex-col sm:flex-col gap-2">
            <AlertDialogAction
              onClick={handleConfirmMatch}
              className="w-full hover:bg-opacity-90 m-0"
              style={{ backgroundColor: '#4a85c8' }}
            >
              Yes, Start Chat
            </AlertDialogAction>
            <AlertDialogCancel className="w-full m-0">
              Not Right Now
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}