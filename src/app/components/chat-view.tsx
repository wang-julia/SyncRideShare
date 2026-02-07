import { useState, useEffect, useRef } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Label } from "@/app/components/ui/label";
import { Send, MapPin, Phone, Mail, Check, Briefcase, Home, CheckCircle, XCircle, Car, Upload, DollarSign, Receipt, Bell, Clock } from "lucide-react";
import { SharedPickupMap } from "@/app/components/shared-pickup-map";
import { Badge } from "@/app/components/ui/badge";
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
import { projectId, publicAnonKey } from '/utils/supabase/info';
import "leaflet/dist/leaflet.css";

interface ChatMessage {
  id: string;
  chatId: string;
  sender: "me" | "them";
  senderId: string;
  message: string;
  timestamp: Date;
}

interface RideRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterInitials: string;
  type: "incoming" | "outgoing";
  status: "pending" | "accepted" | "rejected";
  timestamp: Date;
}

interface RideBookingInfo {
  bookedBy: string;
  totalAmount: number;
  splitAmount: number;
  splitAmountCents: number;
  receiptUrl: string;
  paymentStatus: "pending" | "paid" | "none";
  checkoutSessionId?: string | null;
}

interface ChatViewProps {
  match: {
    id: string;
    name: string;
    initials: string;
    pickupLocation: string;
    distance: string;
  };
  chatId: string;
  userId: string;
  userProfile: {
    phoneNumber: string;
  };
  onBack: () => void;
  onHome?: () => void;
  onDeleteChat?: (chatId: string) => void;
}

export function ChatView({ match, chatId, userId, userProfile, onBack, onHome, onDeleteChat }: ChatViewProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [confirmations, setConfirmations] = useState<Record<string, boolean>>({});
  const [baggageSize, setBaggageSize] = useState<"small" | "medium" | "large">("medium");
  const [pickupLocation, setPickupLocation] = useState<[number, number]>([40.8090, -73.9612]);
  const [pickupAddress, setPickupAddress] = useState<string>("Broadway & 116th St");
  const isFullyConfirmed = !!(confirmations[userId] && confirmations[match.id]);
  const isCurrentUserConfirmed = !!confirmations[userId];

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c63c7d45`;

  // Load chat details and messages on mount
  useEffect(() => {
    loadChatDetails();
    loadMessages();
  }, [chatId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChatDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/chat/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      // Check if response is ok before parsing
      if (!response.ok) {
        console.log("Chat details not found or error, using defaults");
        return;
      }
      
      const data = await response.json();
      
      if (data.success && data.chat) {
        console.log("Loaded chat details:", data.chat);
        if (data.chat.confirmations) {
          setConfirmations(data.chat.confirmations);
        }
        // Load saved baggage size
        if (data.chat.baggageSize) {
          setBaggageSize(data.chat.baggageSize);
        }
        // Load saved pickup location
        if (data.chat.pickupLocation && data.chat.pickupLocation.length === 2) {
          setPickupLocation(data.chat.pickupLocation);
        }
        // Load saved pickup address
        if (data.chat.pickupAddress) {
          setPickupAddress(data.chat.pickupAddress);
        }
        if (data.chat.rideBookingInfo) {
          const storedInfo = data.chat.rideBookingInfo as RideBookingInfo;
          const splitAmountCents = storedInfo.splitAmountCents ?? Math.round(storedInfo.splitAmount * 100);
          setRideBookingInfo({ ...storedInfo, splitAmountCents });
        }
      }
    } catch (error) {
      console.log("Error loading chat details, using defaults:", error);
      // Don't throw - just continue with default values
    }
  };

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/messages/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      const data = await response.json();
      
      if (data.success && data.messages.length > 0) {
        // Convert timestamp strings back to Date objects and determine sender
        const parsedMessages = data.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          sender: msg.senderId === userId ? 'me' : 'them',
        }));
        setMessages(parsedMessages);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  // Ride booking states
  const [isRideBookedDialogOpen, setIsRideBookedDialogOpen] = useState(false);
  const [rideAmount, setRideAmount] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [rideBookingInfo, setRideBookingInfo] = useState<RideBookingInfo | null>(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [pendingCheckoutSessionId, setPendingCheckoutSessionId] = useState<string | null>(null);

  // Mock ride requests data - in real implementation, fetch from Supabase
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([
    {
      id: "req-1",
      requesterId: "user-123",
      requesterName: "Sarah Chen",
      requesterInitials: "SC",
      type: "incoming",
      status: "pending",
      timestamp: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
    },
    {
      id: "req-2",
      requesterId: "user-456",
      requesterName: "Mike Johnson",
      requesterInitials: "MJ",
      type: "outgoing",
      status: "pending",
      timestamp: new Date(Date.now() - 1000 * 60 * 45) // 45 minutes ago
    }
  ]);

  const pendingRequests = rideRequests.filter(r => r.status === "pending");
  const incomingRequests = pendingRequests.filter(r => r.type === "incoming");
  const outgoingRequests = pendingRequests.filter(r => r.type === "outgoing");

  const handleAcceptRequest = (requestId: string) => {
    setRideRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: "accepted" as const } : req
    ));
    // In real implementation, create a new chat and navigate to it
  };

  const handleRejectRequest = (requestId: string) => {
    setRideRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: "rejected" as const } : req
    ));
  };

  const handleCancelRequest = (requestId: string) => {
    setRideRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const formatRequestTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleLocationChange = async (location: [number, number], address: string) => {
    setPickupLocation(location);
    setPickupAddress(address);
    
    // Save pickup location to Supabase
    try {
      await fetch(`${API_URL}/chat/${chatId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          pickupLocation: location,
          pickupAddress: address,
        }),
      });
    } catch (error) {
      console.error("Error saving pickup location:", error);
    }
    
    // Add system message about location update
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      chatId,
      sender: "them",
      senderId: match.id,
      message: `📍 Pickup location updated to: ${address.split(',')[0]}`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleConfirmRide = async () => {
    const nextConfirmations = {
      ...confirmations,
      [userId]: true,
    };
    setConfirmations(nextConfirmations);
    setIsConfirmDialogOpen(false);
    
    // Save confirmation state to Supabase
    try {
      await fetch(`${API_URL}/chat/${chatId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          confirmations: nextConfirmations,
          baggageSize: baggageSize,
          pickupLocation: pickupLocation,
          pickupAddress: pickupAddress,
        }),
      });
    } catch (error) {
      console.error("Error saving confirmation:", error);
    }
    
    // Add confirmation message to chat
    const confirmMessage: ChatMessage = {
      id: Date.now().toString(),
      chatId,
      sender: "me",
      senderId: userId,
      message: "✅ I confirmed the ride. Waiting for you to confirm too!",
      timestamp: new Date(),
    };
    
    // Save to database
    saveMessage(confirmMessage);
  };

  const saveMessage = async (msg: ChatMessage) => {
    try {
      // Optimistically add message to UI
      setMessages(prev => [...prev, msg]);
      
      const response = await fetch(`${API_URL}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(msg),
      });
      const data = await response.json();
      
      if (!data.success) {
        console.error("Failed to save message:", data.error);
        // Remove the message from UI if save failed
        setMessages(prev => prev.filter(m => m.id !== msg.id));
      }
    } catch (error) {
      console.error("Error saving message:", error);
      // Remove the message from UI if save failed
      setMessages(prev => prev.filter(m => m.id !== msg.id));
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      chatId,
      sender: "me",
      senderId: userId,
      message: message.trim(),
      timestamp: new Date(),
    };

    setMessage("");
    await saveMessage(newMessage);
  };

  const flowgladStorageKey = `flowgladCheckoutSession:${chatId}`;

  const buildFlowgladReturnUrl = (result: "success" | "cancel") => {
    const url = new URL(window.location.href);
    url.searchParams.set("flowgladResult", result);
    return url.toString();
  };

  const clearFlowgladReturnParams = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("flowgladResult");
    window.history.replaceState({}, "", url.toString());
  };

  const persistRideBookingInfo = async (nextInfo: RideBookingInfo) => {
    setRideBookingInfo(nextInfo);
    try {
      await fetch(`${API_URL}/chat/${chatId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          rideBookingInfo: nextInfo,
        }),
      });
    } catch (error) {
      console.error("Error saving ride booking info:", error);
    }
  };

  const verifyFlowgladCheckoutSession = async (checkoutSessionId: string) => {
    if (!rideBookingInfo) return;

    setIsPaymentLoading(true);
    setPaymentError(null);

    try {
      const response = await fetch(`${API_URL}/flowglad/checkout-session/${checkoutSessionId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      const data = await response.json();

      if (!data.success || !data.checkoutSession) {
        throw new Error("Unable to verify payment status.");
      }

      const status = data.checkoutSession.status;
      const isPaid = ["complete", "paid", "succeeded"].includes(status);

      if (isPaid && rideBookingInfo.paymentStatus !== "paid") {
        const updatedInfo = {
          ...rideBookingInfo,
          paymentStatus: "paid" as const,
          checkoutSessionId,
        };
        await persistRideBookingInfo(updatedInfo);

        if (rideBookingInfo.bookedBy !== userId) {
          const paymentMessage: ChatMessage = {
            id: Date.now().toString(),
            chatId,
            sender: "me",
            senderId: userId,
            message: `✅ Payment of $${rideBookingInfo.splitAmount.toFixed(2)} sent successfully!`,
            timestamp: new Date(),
          };
          saveMessage(paymentMessage);
        }
      } else if (!isPaid) {
        setPaymentError("Payment is not completed yet. If you just paid, please refresh in a few seconds.");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      setPaymentError("We couldn't confirm the payment. Please try again.");
    } finally {
      setIsPaymentLoading(false);
      setPendingCheckoutSessionId(null);
      localStorage.removeItem(flowgladStorageKey);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get("flowgladResult");
    if (!result) return;

    if (result === "success") {
      const storedSessionId = localStorage.getItem(flowgladStorageKey);
      if (storedSessionId) {
        setPendingCheckoutSessionId(storedSessionId);
      } else {
        setPaymentError("We couldn't find the payment session. Please try again.");
      }
    }

    if (result === "cancel") {
      setPaymentError("Payment was canceled.");
    }

    clearFlowgladReturnParams();
  }, [chatId]);

  useEffect(() => {
    if (!pendingCheckoutSessionId || !rideBookingInfo) return;
    if (rideBookingInfo.paymentStatus === "paid") {
      setPendingCheckoutSessionId(null);
      localStorage.removeItem(flowgladStorageKey);
      return;
    }
    verifyFlowgladCheckoutSession(pendingCheckoutSessionId);
  }, [pendingCheckoutSessionId, rideBookingInfo]);

  const handleCompleteRide = async () => {
    try {
      await Promise.all([
        fetch(`${API_URL}/ride-requests/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }),
        fetch(`${API_URL}/ride-requests/${match.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }),
      ]);

      // Delete the chat from the backend
      const response = await fetch(`${API_URL}/chat/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        // Call the delete callback if provided
        if (onDeleteChat) {
          onDeleteChat(chatId);
        }
        // Navigate back to chat list
        onBack();
      } else {
        console.error("Failed to delete chat:", data.error);
      }
    } catch (error) {
      console.error("Error completing ride:", error);
    }
  };

  const handleCancelRide = async () => {
    try {
      await Promise.all([
        fetch(`${API_URL}/ride-requests/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }),
        fetch(`${API_URL}/ride-requests/${match.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }),
      ]);

      // Delete the chat from the backend
      const response = await fetch(`${API_URL}/chat/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        // Call the delete callback if provided
        if (onDeleteChat) {
          onDeleteChat(chatId);
        }
        // Navigate back to chat list
        onBack();
      } else {
        console.error("Failed to delete chat:", data.error);
      }
    } catch (error) {
      console.error("Error canceling ride:", error);
    }
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitRideBooking = async () => {
    if (!rideAmount || parseFloat(rideAmount) <= 0) {
      alert("Please enter a valid ride amount");
      return;
    }

    const totalAmount = parseFloat(rideAmount);
    const totalCents = Math.round(totalAmount * 100);
    const splitCents = Math.floor(totalCents / 2);
    const splitAmount = splitCents / 100;

    // In real implementation, upload receipt to storage and save to Supabase
    // For now, just simulate the booking
    const bookingInfo: RideBookingInfo = {
      bookedBy: userId,
      totalAmount,
      splitAmount,
      splitAmountCents: splitCents,
      receiptUrl: receiptPreview || "",
      paymentStatus: "pending" as const,
    };

    await persistRideBookingInfo(bookingInfo);
    setIsRideBookedDialogOpen(false);

    // Add system message to chat
    const bookingMessage: ChatMessage = {
      id: Date.now().toString(),
      chatId,
      sender: "me",
      senderId: userId,
      message: `🚗 Ride booked! Total cost: $${totalAmount.toFixed(2)}. Your share: $${splitAmount.toFixed(2)}`,
      timestamp: new Date(),
    };
    saveMessage(bookingMessage);
  };

  const handlePayment = async () => {
    if (!rideBookingInfo) return;

    setIsPaymentLoading(true);
    setPaymentError(null);

    try {
      const quantity = Math.max(1, rideBookingInfo.splitAmountCents || Math.round(rideBookingInfo.splitAmount * 100));
      const response = await fetch(`${API_URL}/flowglad/checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          customerExternalId: userId,
          quantity,
          successUrl: buildFlowgladReturnUrl("success"),
          cancelUrl: buildFlowgladReturnUrl("cancel"),
          outputName: "Ride split payment",
          outputMetadata: {
            chatId,
            bookedBy: rideBookingInfo.bookedBy,
            totalAmount: rideBookingInfo.totalAmount,
            splitAmount: rideBookingInfo.splitAmount,
          },
        }),
      });

      const data = await response.json();
      if (!data.success || !data.checkoutSession?.url || !data.checkoutSession?.id) {
        throw new Error("Failed to create checkout session.");
      }

      const updatedInfo = {
        ...rideBookingInfo,
        checkoutSessionId: data.checkoutSession.id,
      };

      localStorage.setItem(flowgladStorageKey, data.checkoutSession.id);
      await persistRideBookingInfo(updatedInfo);

      window.location.href = data.checkoutSession.url;
    } catch (error) {
      console.error("Error starting payment:", error);
      setPaymentError("We couldn't start the payment. Please try again.");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white border-b p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 ring-2 ring-offset-2 ring-[#4a85c8]">
                <AvatarFallback style={{ backgroundColor: '#4a85c8' }} className="text-white">
                  {match.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-lg">{match.name}</div>
                <div className="text-sm text-gray-500">{match.distance}</div>
              </div>
            </div>
            {!isCurrentUserConfirmed && (
              <Button 
                onClick={() => setIsConfirmDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Check className="w-4 h-4 mr-1" />
                Confirm
              </Button>
            )}
            {isCurrentUserConfirmed && !isFullyConfirmed && (
              <Button
                disabled
                className="bg-yellow-500 text-white shadow-inner cursor-default opacity-100"
                size="sm"
              >
                <Clock className="w-4 h-4 mr-1" />
                Waiting
              </Button>
            )}
            {isFullyConfirmed && (
              <Button
                disabled
                className="bg-green-600 text-white shadow-inner cursor-default opacity-100"
                size="sm"
              >
                <Check className="w-4 h-4 mr-1" />
                Confirmed
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
            <TabsTrigger value="map" className="flex-1">Map</TabsTrigger>
            <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="p-4">
            {/* Messages */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Loading messages...</p>
              </div>
            ) : (
              <div className="space-y-4 mb-20">
                {messages.length === 0 ? (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.sender === "me"
                            ? "text-white"
                            : "bg-gray-200 text-gray-900"
                        } rounded-2xl max-w-[75%]`}
                        style={msg.sender === "me" ? { backgroundColor: '#4a85c8' } : undefined}
                      >
                        <p>{msg.message}</p>
                        <p className={`text-xs mt-1 ${msg.sender === "me" ? "text-gray-100" : "text-gray-500"}`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
            {/* Message Input */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 max-w-md mx-auto">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button
                  type="submit"
                  className="hover:bg-opacity-90"
                  style={{ backgroundColor: '#4a85c8' }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </TabsContent>

          {/* Map Tab */}
          <TabsContent value="map" className="p-4">
            <div className="h-[500px] rounded-lg overflow-hidden border-2" style={{ borderColor: '#4a85c8' }}>
              <SharedPickupMap
                suggestedLocation={pickupLocation}
                onLocationChange={handleLocationChange}
                isLocked={isFullyConfirmed}
              />
            </div>
            <Card className="mt-4 p-4 border" style={{ backgroundColor: '#e8f1fa', borderColor: '#4a85c8' }}>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5" style={{ color: '#4a85c8' }} />
                <span className="">Shared Pickup Location</span>
              </div>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-sm text-gray-600 mb-1">Current Pickup Point</div>
                  <div className="text-sm">{pickupAddress}</div>
                </div>
                {!isFullyConfirmed && (
                  <div className="text-xs text-gray-600 bg-white rounded-lg p-3">
                    💡 This is the suggested meetup point based on both of your locations. 
                    Drag the pin on the map to adjust if needed. Changes will be visible to both of you.
                  </div>
                )}
                {isFullyConfirmed && (
                  <div className="text-xs text-green-600 bg-white rounded-lg p-3">
                    ✓ Location confirmed and locked. The pickup point is finalized.
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="p-4 space-y-3">
            {/* Contact Information Card */}
            <Card className="p-4">
              <h3 className="mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4" style={{ color: '#4a85c8' }} />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm bg-gray-50 p-3 rounded-lg">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <span>{userProfile.phoneNumber || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm bg-gray-50 p-3 rounded-lg">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <span>{match.name.toLowerCase().replace(" ", ".")}@columbia.edu</span>
                </div>
              </div>
            </Card>

            {/* Departure Time Card */}
            <Card className="p-4">
              <h3 className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                Departure Time
              </h3>
              <p className="text-lg">Today, 2:00 PM</p>
            </Card>

            {/* Cost Card */}
            <Card className="p-4 bg-green-50 border-green-200">
              <h3 className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                Estimated Cost
              </h3>
              <p className="text-2xl text-green-600">$28 <span className="text-sm text-gray-600">per person</span></p>
            </Card>

            {/* Ride Time Card */}
            <Card className="p-4">
              <h3 className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                Ride Duration
              </h3>
              <p className="text-lg">~45 minutes</p>
            </Card>

            {/* Vehicle Card */}
            <Card className="p-4">
              <h3 className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                Vehicle Type
              </h3>
              <p className="text-lg">Uber XL</p>
            </Card>

            {/* Baggage Size Card */}
            <Card className="p-4">
              <h3 className="mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4" style={{ color: '#4a85c8' }} />
                Your Baggage Size
              </h3>
              <RadioGroup
                value={baggageSize}
                onValueChange={async (value) => {
                  const newSize = value as "small" | "medium" | "large";
                  setBaggageSize(newSize);
                  
                  // Save baggage size to Supabase
                  try {
                    await fetch(`${API_URL}/chat/${chatId}`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${publicAnonKey}`,
                      },
                      body: JSON.stringify({
                        baggageSize: newSize,
                      }),
                    });
                  } catch (error) {
                    console.error("Error saving baggage size:", error);
                  }
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="small" id="small-details" />
                  <Label htmlFor="small-details" className="cursor-pointer">Small (backpack)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium-details" />
                  <Label htmlFor="medium-details" className="cursor-pointer">Medium (carry-on)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="large-details" />
                  <Label htmlFor="large-details" className="cursor-pointer">Large (checked bag)</Label>
                </div>
              </RadioGroup>
            </Card>

            {/* Confirm Button */}
            {!isCurrentUserConfirmed && (
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setIsConfirmDialogOpen(true)}
              >
                <Check className="w-4 h-4 mr-2" />
                Confirm Ride Share
              </Button>
            )}
            {isCurrentUserConfirmed && !isFullyConfirmed && (
              <Button 
                disabled
                className="w-full bg-yellow-500 text-white shadow-inner cursor-default opacity-100"
              >
                <Clock className="w-4 h-4 mr-2" />
                Waiting For {match.name.split(" ")[0]}
              </Button>
            )}
            {isFullyConfirmed && (
              <Button 
                disabled
                className="w-full bg-green-600 text-white shadow-inner cursor-default opacity-100"
              >
                <Check className="w-4 h-4 mr-2" />
                Ride Confirmed
              </Button>
            )}

            {/* Ride Booked Button and Payment Card */}
            {!rideBookingInfo && (
              <Button 
                className="w-full hover:bg-opacity-90" 
                style={{ backgroundColor: '#4a85c8' }}
                onClick={() => setIsRideBookedDialogOpen(true)}
              >
                <Car className="w-4 h-4 mr-2" />
                I Booked the Ride
              </Button>
            )}

            {/* Payment Status Card */}
            {rideBookingInfo && (
              <Card className="p-4 border-2" style={{ borderColor: '#4a85c8', backgroundColor: '#e8f1fa' }}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-5 h-5" style={{ color: '#4a85c8' }} />
                      <h3 className="font-semibold">Ride Booked</h3>
                    </div>
                    {rideBookingInfo.paymentStatus === "paid" && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                  </div>

                  <div className="bg-white rounded-lg p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Cost:</span>
                      <span className="font-semibold">${rideBookingInfo.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Your Share:</span>
                      <span className="font-semibold text-green-600">${rideBookingInfo.splitAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {rideBookingInfo.receiptUrl && (
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm text-gray-600 mb-2">Receipt:</p>
                      <img src={rideBookingInfo.receiptUrl} alt="Receipt" className="w-full rounded border" />
                    </div>
                  )}

                  {rideBookingInfo.bookedBy === userId ? (
                    <div className="bg-white rounded-lg p-3 text-sm text-gray-600">
                      {rideBookingInfo.paymentStatus === "pending" ? (
                        <>⏳ Waiting for {match.name} to pay their share...</>
                      ) : (
                        <>✅ Payment received! ${rideBookingInfo.splitAmount.toFixed(2)} will be transferred to your account via Stripe.</>
                      )}
                    </div>
                  ) : (
                    <>
                      {rideBookingInfo.paymentStatus === "pending" ? (
                        <>
                          <Button 
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={handlePayment}
                            disabled={isPaymentLoading}
                          >
                            <DollarSign className="w-4 h-4 mr-2" />
                            {isPaymentLoading
                              ? "Starting Flowglad checkout..."
                              : `Pay $${rideBookingInfo.splitAmount.toFixed(2)} via Flowglad`}
                          </Button>
                          {paymentError && (
                            <div className="mt-2 text-xs text-red-600 text-center">
                              {paymentError}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 text-center">
                          ✅ Payment sent successfully!
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Card>
            )}

            {/* Complete and Cancel Ride Buttons */}
            <div className="flex gap-3 pt-2">
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setIsCompleteDialogOpen(true)}
                disabled={rideBookingInfo ? rideBookingInfo.paymentStatus !== "paid" : false}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Ride Completed
              </Button>
              <Button 
                variant="outline"
                className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                onClick={() => setIsCancelDialogOpen(true)}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancel Ride
              </Button>
            </div>
            {rideBookingInfo && rideBookingInfo.paymentStatus !== "paid" && (
              <p className="text-xs text-gray-500 text-center mt-2">
                💡 Complete payment before marking the ride as completed
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Ride Share</AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm the ride details and select your baggage size.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-gray-600" />
              <span className="text-sm">Baggage Size:</span>
            </div>
            <RadioGroup
              value={baggageSize}
              onValueChange={(value) => setBaggageSize(value as "small" | "medium" | "large")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" />
                <Label className="text-sm">Small</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" />
                <Label className="text-sm">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" />
                <Label className="text-sm">Large</Label>
              </div>
            </RadioGroup>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRide}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Complete Ride Dialog */}
      <AlertDialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Ride</AlertDialogTitle>
            <AlertDialogDescription>
              Mark this ride as completed? This will remove the chat from your list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                setIsCompleteDialogOpen(false);
                handleCompleteRide();
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Complete Ride
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Ride Dialog */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Ride</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this ride? This will remove the chat from your list and you'll need to find a new match.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                setIsCancelDialogOpen(false);
                handleCancelRide();
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Cancel Ride
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Ride Booking Dialog */}
      <AlertDialog open={isRideBookedDialogOpen} onOpenChange={setIsRideBookedDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Book the Ride</AlertDialogTitle>
            <AlertDialogDescription>
              Please enter the total ride amount and upload a receipt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-gray-600" />
              <span className="text-sm">Total Ride Amount:</span>
            </div>
            <Input
              value={rideAmount}
              onChange={(e) => setRideAmount(e.target.value)}
              placeholder="Enter total amount"
              className="w-full"
            />
            <div className="flex items-center gap-3">
              <Receipt className="w-5 h-5 text-gray-600" />
              <span className="text-sm">Upload Receipt:</span>
            </div>
            <Input
              type="file"
              onChange={handleReceiptUpload}
              className="w-full"
            />
            {receiptPreview && (
              <div className="mt-2">
                <img src={receiptPreview} alt="Receipt Preview" className="w-full rounded border" />
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitRideBooking}>
              Book Ride
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
