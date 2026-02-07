import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Plus, MessageCircle, Check, LogOut, User, MapPin, Inbox, ArrowRight, Clock, X, UserCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { useState } from "react";

interface Chat {
  id: string;
  match: {
    id: string;
    name: string;
    initials: string;
    pickupLocation: string;
    distance: string;
  };
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isConfirmed: boolean;
}

interface RideRequest {
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

interface OutgoingRequest {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientInitials: string;
  destination: string;
  departureTime: string;
  status: "pending" | "accepted" | "rejected";
  acceptedByName?: string;
  timestamp: Date;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: "male" | "female" | "non-binary" | "prefer-not-to-say";
}

interface ChatListProps {
  userProfile: UserProfile;
  chats: Chat[];
  onSelectChat: (chat: Chat) => void;
  onNewRide: () => void;
  onLogout: () => void;
  onProfile?: () => void;
  onInbox?: () => void;
  pendingRequestsCount?: number;
  incomingRequests?: RideRequest[];
  outgoingRequests?: OutgoingRequest[];
  onAcceptRequest?: (request: RideRequest) => void;
  onRejectRequest?: (requestId: string) => void;
  onCancelRequest?: (requestId: string) => void;
}

export function ChatList({ 
  userProfile, 
  chats, 
  onSelectChat, 
  onNewRide, 
  onLogout, 
  onProfile, 
  onInbox, 
  pendingRequestsCount = 0,
  incomingRequests = [],
  outgoingRequests = [],
  onAcceptRequest,
  onRejectRequest,
  onCancelRequest
}: ChatListProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white border-b p-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 ring-2 ring-offset-2 ring-[#4a85c8]">
                <AvatarFallback style={{ backgroundColor: '#4a85c8' }} className="text-white text-lg">
                  {getInitials(userProfile.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-lg font-semibold">{userProfile.name}</div>
                <div className="text-xs text-gray-500">{userProfile.email}</div>
              </div>
            </div>
            <div className="flex gap-2">
              {onInbox && (
                <Button
                  onClick={onInbox}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 relative"
                >
                  <Inbox className="w-4 h-4" />
                  {pendingRequestsCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#4a85c8' }}>
                      {pendingRequestsCount}
                    </Badge>
                  )}
                </Button>
              )}
              {onProfile && (
                <Button
                  onClick={onProfile}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100"
                >
                  <User className="w-4 h-4" />
                </Button>
              )}
              <Button
                onClick={() => setIsLoggingOut(true)}
                size="icon"
                className="hover:bg-opacity-90"
                style={{ backgroundColor: '#4a85c8' }}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Your Rides</h2>
        </div>

        {/* New Ride Button */}
        <div className="p-4">
          <Button
            onClick={onNewRide}
            className="w-full hover:bg-opacity-90 shadow-md h-12 text-base font-semibold"
            style={{ backgroundColor: '#4a85c8' }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Find New Ride
          </Button>
        </div>

        {/* Inbox Section */}
        {(incomingRequests.length > 0 || outgoingRequests.length > 0) && (
          <div className="px-4 pb-4">
            <Card className="shadow-md border-2" style={{ borderColor: '#4a85c8', backgroundColor: '#f0f7ff' }}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Inbox className="w-5 h-5" style={{ color: '#4a85c8' }} />
                    <h3 className="font-semibold text-gray-900">Ride Requests</h3>
                  </div>
                  <Badge className="text-white" style={{ backgroundColor: '#4a85c8' }}>
                    {incomingRequests.length + outgoingRequests.length}
                  </Badge>
                </div>

                {/* Incoming Requests */}
                {incomingRequests.length > 0 && (
                  <div className="space-y-2 mb-3">
                    <div className="text-xs text-gray-600 mb-2">Incoming ({incomingRequests.length})</div>
                    {incomingRequests.slice(0, 2).map((request) => (
                      <div key={request.id} className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback style={{ backgroundColor: '#4a85c8' }} className="text-white text-xs">
                                {request.requesterInitials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-sm">{request.requesterName}</div>
                              <div className="text-xs text-gray-500">{request.destination} • {formatTime(request.timestamp)}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {onRejectRequest && (
                            <Button
                              onClick={() => onRejectRequest(request.id)}
                              variant="outline"
                              size="sm"
                              className="flex-1 h-8 text-xs"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Decline
                            </Button>
                          )}
                          {onAcceptRequest && (
                            <Button
                              onClick={() => onAcceptRequest(request)}
                              size="sm"
                              className="flex-1 h-8 text-xs text-white"
                              style={{ backgroundColor: '#4a85c8' }}
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Accept
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {incomingRequests.length > 2 && (
                      <Button
                        onClick={onInbox}
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs h-8"
                        style={{ color: '#4a85c8' }}
                      >
                        View all {incomingRequests.length} incoming requests
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>
                )}

                {/* Outgoing Requests */}
                {outgoingRequests.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs text-orange-700 mb-2 font-medium">Your Ride Request</div>
                    {outgoingRequests.slice(0, 1).map((request) => (
                      <div key={request.id} className="bg-orange-50 rounded-lg p-3 border-2 border-orange-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            <Avatar className="w-8 h-8 ring-2 ring-orange-300">
                              <AvatarFallback className="bg-orange-500 text-white text-xs">
                                {request.recipientInitials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm text-gray-900">
                                {request.status === "accepted" && request.acceptedByName
                                  ? `Fulfilled by ${request.acceptedByName}`
                                  : `Waiting for ${request.recipientName}`}
                              </div>
                              <div className="text-xs text-gray-600 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-orange-500" />
                                {request.destination} • {formatTime(request.timestamp)}
                              </div>
                            </div>
                          </div>
                          {request.status === "pending" && onCancelRequest && (
                            <Button
                              onClick={() => onCancelRequest(request.id)}
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-100"
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Active Chats Section */}
        <div className="px-4 pb-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Active Rides</h3>
        </div>

        {/* Chat List */}
        <div className="px-4 pb-4 space-y-3">
          {chats.length === 0 ? (
            <Card className="p-8 text-center shadow-md">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10" style={{ color: '#4a85c8' }} />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Active Rides</h3>
              <p className="text-gray-500 mb-4 text-sm">Start your journey by finding a ride share partner</p>
              <Button
                onClick={onNewRide}
                variant="outline"
                className="border-2 font-semibold"
                style={{ borderColor: '#4a85c8', color: '#4a85c8' }}
              >
                Find Your First Ride
              </Button>
            </Card>
          ) : (
            chats.map((chat) => (
              <Card
                key={chat.id}
                className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-l-4"
                style={{ borderLeftColor: chat.isConfirmed ? '#10b981' : '#4a85c8' }}
                onClick={() => onSelectChat(chat)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-14 h-14 flex-shrink-0 ring-2 ring-offset-2 ring-[#4a85c8]">
                    <AvatarFallback style={{ backgroundColor: '#4a85c8' }} className="text-white text-lg font-semibold">
                      {chat.match.initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{chat.match.name}</span>
                        {chat.isConfirmed && (
                          <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                            <Check className="w-3 h-3" />
                            Confirmed
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatTime(chat.lastMessageTime)}
                      </span>
                    </div>

                    <p className={`text-sm truncate mb-2 ${chat.unreadCount > 0 ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                      {chat.lastMessage || "No messages yet"}
                    </p>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500 min-w-0 flex-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate block">{chat.match.pickupLocation}</span>
                      </div>
                      {chat.unreadCount > 0 && (
                        <Badge className="text-white h-5 min-w-5 rounded-full font-semibold shadow-sm" style={{ backgroundColor: '#4a85c8' }}>
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-sm w-full p-6 shadow-xl">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Log Out</h3>
              <p className="text-gray-600">Are you sure you want to log out?</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setIsLoggingOut(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogout}
                className="flex-1 hover:bg-opacity-90"
                style={{ backgroundColor: '#4a85c8' }}
              >
                Log Out
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
