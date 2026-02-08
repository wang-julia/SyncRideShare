import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Plus, MessageCircle, Check, LogOut, User, MapPin, Inbox, ArrowRight, Clock, X, UserCheck, Sparkles, Bot, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { useState } from "react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

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
  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c63c7d45`;
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
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMode, setAiMode] = useState<"optimizer" | "ask">("optimizer");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiAnswer, setAiAnswer] = useState<string>("");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAirport, setAiAirport] = useState(outgoingRequests[0]?.destination || "");
  const [aiPickupArea, setAiPickupArea] = useState(outgoingRequests[0]?.pickupLocation || "");
  const [aiPickupTime, setAiPickupTime] = useState(outgoingRequests[0]?.departureTime || "");
  const [isGeminiOpen, setIsGeminiOpen] = useState(false);
  const [geminiInput, setGeminiInput] = useState("");
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [geminiError, setGeminiError] = useState<string | null>(null);
  const [geminiMessages, setGeminiMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([]);

  const handleLogout = () => {
    onLogout();
  };

  const runOptimizer = async () => {
    setAiLoading(true);
    setAiError(null);
    setAiAnswer("");
    try {
      const response = await fetch(`${API_URL}/ai/optimizer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          airport: aiAirport,
          pickupArea: aiPickupArea,
          pickupTime: aiPickupTime,
          userId: userProfile.id,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Optimizer failed");
      }
      setAiAnswer(data.data?.aiText || data.data?.summary || "No recommendation available.");
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "Optimizer failed");
    } finally {
      setAiLoading(false);
    }
  };

  const runAsk = async () => {
    setAiLoading(true);
    setAiError(null);
    setAiAnswer("");
    try {
      const response = await fetch(`${API_URL}/ai/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          question: aiQuestion,
          airport: aiAirport || undefined,
          pickupArea: aiPickupArea || undefined,
          userId: userProfile.id,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Assistant failed");
      }
      setAiAnswer(data.data?.answer || "No answer available.");
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "Assistant failed");
    } finally {
      setAiLoading(false);
    }
  };

  const runGemini = async () => {
    if (!geminiInput.trim()) return;
    const userMessage = { role: "user" as const, text: geminiInput.trim() };
    setGeminiMessages((prev) => [...prev, userMessage]);
    setGeminiInput("");
    setGeminiLoading(true);
    setGeminiError(null);
    try {
      const response = await fetch(`${API_URL}/gemini/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          question: userMessage.text,
          messages: [...geminiMessages, userMessage],
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Gemini request failed");
      }
      setGeminiMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.data?.answer || "No answer available." },
      ]);
    } catch (error) {
      setGeminiError(error instanceof Error ? error.message : "Gemini request failed");
    } finally {
      setGeminiLoading(false);
    }
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
            Array.from(new Map(chats.map(chat => [chat.id, chat])).values()).map((chat) => (
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

      {/* AI Assistant Floating Widgets */}
      <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-2">
        {!isGeminiOpen && (
          <Button
            onClick={() => setIsGeminiOpen(true)}
            className="rounded-full shadow-lg h-12 px-4"
            style={{ backgroundColor: '#0f172a' }}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Gemini Chat
          </Button>
        )}
        {!isAiOpen && (
          <Button
            onClick={() => setIsAiOpen(true)}
            className="rounded-full shadow-lg h-12 px-4"
            style={{ backgroundColor: '#111827' }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Ride AI
          </Button>
        )}
      </div>

      {isAiOpen && (
        <div className="fixed bottom-5 right-4 z-50 w-[320px] max-w-[90vw]">
          <Card className="shadow-2xl border border-gray-200">
            <div className="p-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <div className="text-sm font-semibold">Snowflake Ride AI</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsAiOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-3 space-y-3">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={aiMode === "optimizer" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setAiMode("optimizer")}
                  style={aiMode === "optimizer" ? { backgroundColor: '#4a85c8' } : undefined}
                >
                  Optimizer
                </Button>
                <Button
                  size="sm"
                  variant={aiMode === "ask" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setAiMode("ask")}
                  style={aiMode === "ask" ? { backgroundColor: '#4a85c8' } : undefined}
                >
                  Ask
                </Button>
              </div>

              {aiMode === "optimizer" ? (
                <div className="space-y-2">
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    placeholder="Airport (JFK, LGA...)"
                    value={aiAirport}
                    onChange={(e) => setAiAirport(e.target.value)}
                  />
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    placeholder="Pickup area (Morningside Heights)"
                    value={aiPickupArea}
                    onChange={(e) => setAiPickupArea(e.target.value)}
                  />
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    type="datetime-local"
                    value={aiPickupTime}
                    onChange={(e) => setAiPickupTime(e.target.value)}
                  />
                  <Button
                    className="w-full"
                    onClick={runOptimizer}
                    disabled={aiLoading}
                    style={{ backgroundColor: '#4a85c8' }}
                  >
                    {aiLoading ? "Analyzing..." : "Get Recommendation"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    placeholder="Ask a question..."
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className="w-full border rounded-md px-2 py-2 text-sm"
                      placeholder="Airport (optional)"
                      value={aiAirport}
                      onChange={(e) => setAiAirport(e.target.value)}
                    />
                    <input
                      className="w-full border rounded-md px-2 py-2 text-sm"
                      placeholder="Area (optional)"
                      value={aiPickupArea}
                      onChange={(e) => setAiPickupArea(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={runAsk}
                    disabled={aiLoading || !aiQuestion.trim()}
                    style={{ backgroundColor: '#4a85c8' }}
                  >
                    {aiLoading ? "Thinking..." : "Ask Snowflake"}
                  </Button>
                </div>
              )}

              {aiError && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                  {aiError}
                </div>
              )}
              {aiAnswer && (
                <div className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-md p-2 whitespace-pre-line">
                  {aiAnswer}
                </div>
              )}
              <div className="text-[10px] text-gray-400">
                Powered by Snowflake Cortex. Analytics only; no user data exposed outside Snowflake.
              </div>
            </div>
          </Card>
        </div>
      )}

      {isGeminiOpen && (
        <div className="fixed bottom-5 right-4 z-50 w-[340px] max-w-[92vw]">
          <Card className="shadow-2xl border border-gray-200">
            <div className="p-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <div className="text-sm font-semibold">Gemini Ride Chat</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsGeminiOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-3 space-y-2">
              <div className="h-48 overflow-y-auto border rounded-md p-2 bg-gray-50 text-sm space-y-2">
                {geminiMessages.length === 0 && (
                  <div className="text-gray-500">Ask anything about travel, rides, or general questions.</div>
                )}
                {geminiMessages.map((msg, idx) => (
                  <div
                    key={`${msg.role}-${idx}`}
                    className={msg.role === "user" ? "text-right" : "text-left"}
                  >
                    <div
                      className={`inline-block px-3 py-2 rounded-lg ${
                        msg.role === "user" ? "bg-blue-600 text-white" : "bg-white border text-gray-800"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              {geminiError && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                  {geminiError}
                </div>
              )}
              {geminiMessages.length === 0 && (
                <div className="flex flex-wrap gap-2">
                  {[
                    "Best time to leave for JFK?",
                    "How likely is a match at 6pm?",
                    "Busiest days for rides?",
                    "Tips for splitting fares?",
                    "What should I message my match?",
                    "ETA from Columbia to LGA?",
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      className="text-xs h-7 px-2"
                      onClick={() => setGeminiInput(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
              <div className="space-y-2">
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm h-16 resize-none"
                  placeholder="Type your question, then press Send"
                  value={geminiInput}
                  onChange={(e) => setGeminiInput(e.target.value)}
                />
                <Button
                  onClick={runGemini}
                  disabled={geminiLoading || !geminiInput.trim()}
                  className="w-full h-10 text-base font-semibold"
                  style={{ backgroundColor: '#4a85c8' }}
                >
                  {geminiLoading ? "Sending..." : "Ask Gemini"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

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
