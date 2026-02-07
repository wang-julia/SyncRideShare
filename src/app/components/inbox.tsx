import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { ArrowLeft, Check, X, MapPin, Calendar, Plane, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";

export interface RideRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterInitials: string;
  requesterAge: number;
  requesterGender: string;
  pickupLocation: string;
  destination: string;
  departureTime: string;
  distance: string;
  baggageSize: string;
  status: "pending" | "accepted" | "rejected";
  timestamp: Date;
}

interface InboxProps {
  requests: RideRequest[];
  onAcceptRequest: (request: RideRequest) => void;
  onRejectRequest: (requestId: string) => void;
  onBack: () => void;
}

export function Inbox({ requests, onAcceptRequest, onRejectRequest, onBack }: InboxProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const formatDepartureTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getAirportName = (code: string) => {
    const airports: { [key: string]: string } = {
      "JFK": "JFK Airport",
      "LGA": "LaGuardia Airport",
      "EWR": "Newark Airport",
      "PENN": "Penn Station",
      "GCT": "Grand Central Terminal"
    };
    return airports[code] || code;
  };

  const pendingRequests = requests.filter(r => r.status === "pending");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white border-b p-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              onClick={onBack}
              size="icon"
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-2xl font-bold text-gray-800">Ride Requests</h2>
            {pendingRequests.length > 0 && (
              <Badge className="text-white h-6 min-w-6 rounded-full font-semibold" style={{ backgroundColor: '#4a85c8' }}>
                {pendingRequests.length}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 ml-14">Students who want to ride with you</p>
        </div>

        {/* Requests List */}
        <div className="p-4 space-y-4">
          {pendingRequests.length === 0 ? (
            <Card className="p-8 text-center shadow-md">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-10 h-10" style={{ color: '#4a85c8' }} />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Pending Requests</h3>
              <p className="text-gray-500 text-sm">You don't have any ride requests at the moment</p>
            </Card>
          ) : (
            pendingRequests.map((request) => (
              <Card key={request.id} className="p-4 shadow-md border-l-4" style={{ borderLeftColor: '#4a85c8' }}>
                <div className="space-y-4">
                  {/* Requester Info */}
                  <div className="flex items-start gap-3">
                    <Avatar className="w-14 h-14 flex-shrink-0 ring-2 ring-offset-2 ring-[#4a85c8]">
                      <AvatarFallback style={{ backgroundColor: '#4a85c8' }} className="text-white text-lg font-semibold">
                        {request.requesterInitials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900 text-lg">{request.requesterName}</span>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {formatTime(request.timestamp)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {request.requesterAge} • {request.requesterGender}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200"></div>

                  {/* Trip Details */}
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2">
                      <Plane className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#4a85c8' }} />
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-0.5">Destination</div>
                        <div className="font-medium text-gray-900">{getAirportName(request.destination)}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#4a85c8' }} />
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-0.5">Departure Time</div>
                        <div className="font-medium text-gray-900">{formatDepartureTime(request.departureTime)}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#4a85c8' }} />
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-0.5">Pickup Location</div>
                        <div className="font-medium text-gray-900">{request.pickupLocation}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{request.distance} from you</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-xs text-gray-500">Baggage:</div>
                      <Badge variant="outline" className="text-xs">
                        {request.baggageSize}
                      </Badge>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => onRejectRequest(request.id)}
                      variant="outline"
                      className="flex-1 border-2"
                      style={{ borderColor: '#ef4444', color: '#ef4444' }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Decline
                    </Button>
                    <Button
                      onClick={() => onAcceptRequest(request)}
                      className="flex-1 hover:bg-opacity-90 text-white"
                      style={{ backgroundColor: '#4a85c8' }}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Accept
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}