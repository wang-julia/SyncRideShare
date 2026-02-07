import { useState, useEffect } from "react";
import { ProfileCreation, UserProfile, SignupData } from "@/app/components/profile-creation";
import { ChatList } from "@/app/components/chat-list";
import { DestinationSelection } from "@/app/components/destination-selection";
import { PreferencesForm, UserPreferences } from "@/app/components/preferences-form";
import { MatchResults } from "@/app/components/match-results";
import { ChatView } from "@/app/components/chat-view";
import { Welcome } from "@/app/components/welcome";
import { Login } from "@/app/components/login";
import { ProfilePage } from "@/app/components/profile-page";
import { Inbox, RideRequest } from "@/app/components/inbox";
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { supabase } from '/utils/supabase/client';

type AppScreen = "welcome" | "login" | "signup" | "chatList" | "profile" | "destination" | "preferences" | "matches" | "chat" | "inbox";

interface Match {
  id: string;
  name: string;
  initials: string;
  pickupLocation: string;
  distance: string;
}

interface Chat {
  id: string;
  match: Match;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isConfirmed: boolean;
  pickupTime?: string;
}

interface OutgoingRequest {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientInitials: string;
  destination: string;
  departureTime: string;
  status: "pending" | "accepted" | "rejected";
  timestamp: Date;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("welcome");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedAirport, setSelectedAirport] = useState<string>("");
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<OutgoingRequest[]>([]);

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c63c7d45`;

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session?.access_token) {
          // User has an active session
          setAccessToken(session.access_token);
          
          // Load user profile from server
          const response = await fetch(`${API_URL}/profile/${session.user.id}`, {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          });
          const data = await response.json();
          
          if (data.success && data.profile) {
            setUserProfile(data.profile);
            await loadChats(data.profile.id);
            
            // Add mock ride requests for demo purposes
            const mockRequests: RideRequest[] = [
              {
                id: "req_1",
                requesterId: "user_123",
                requesterName: "Sarah Johnson",
                requesterInitials: "SJ",
                requesterAge: 21,
                requesterGender: "female",
                pickupLocation: "John Jay Hall",
                destination: "JFK",
                departureTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                distance: "0.3 miles",
                baggageSize: "Medium",
                status: "pending",
                timestamp: new Date(Date.now() - 30 * 60 * 1000),
              },
              {
                id: "req_2",
                requesterId: "user_456",
                requesterName: "Michael Chen",
                requesterInitials: "MC",
                requesterAge: 23,
                requesterGender: "male",
                pickupLocation: "Wien Hall",
                destination: "LGA",
                departureTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                distance: "0.5 miles",
                baggageSize: "Large",
                status: "pending",
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
              },
            ];
            setRideRequests(mockRequests);
            
            // Add mock outgoing requests
            const mockOutgoingRequests: OutgoingRequest[] = [
              {
                id: "out_req_1",
                recipientId: "user_789",
                recipientName: "Emma Rodriguez",
                recipientInitials: "ER",
                destination: "EWR",
                departureTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
                status: "pending",
                timestamp: new Date(Date.now() - 45 * 60 * 1000),
              },
            ];
            setOutgoingRequests(mockOutgoingRequests);
            
            setCurrentScreen("chatList");
          } else {
            // Session exists but no profile, go to signup
            setCurrentScreen("signup");
          }
        } else {
          // No session, show welcome screen
          setCurrentScreen("welcome");
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setCurrentScreen("welcome");
      }
    };
    
    checkSession();
  }, []);

  const loadChats = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/chats/${userId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        if (data.chats.length > 0) {
          // Convert timestamp strings back to Date objects
          const parsedChats = data.chats.map((chat: any) => ({
            ...chat,
            lastMessageTime: new Date(chat.lastMessageTime),
          }));
          // Sort chats by most recent message first
          parsedChats.sort((a: Chat, b: Chat) => 
            b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
          );
          setChats(parsedChats);
        } else {
          // No chats found, set empty array
          setChats([]);
        }
      }
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  };

  const handleSignup = async (data: SignupData) => {
    try {
      // Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            age: data.age,
            gender: data.gender,
          },
          emailRedirectTo: undefined, // Disable email confirmation redirect
          // Disable email confirmation by not sending a confirmation email
        },
      });

      if (authError) {
        // Handle rate limit errors more gracefully
        if (authError.message.includes('security purposes') || authError.message.includes('seconds')) {
          throw new Error('Please wait a moment before trying again. Supabase has rate limiting to protect your account.');
        }
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error("Failed to create user account");
      }

      console.log("Signup successful, user ID:", authData.user.id);
      console.log("Session available:", !!authData.session);

      // Create profile in KV store regardless of session status
      const profile: UserProfile = {
        id: authData.user.id,
        name: data.name,
        email: data.email,
        age: data.age,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
      };

      const response = await fetch(`${API_URL}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(profile),
      });
      
      const result = await response.json();
      console.log("Profile creation result:", result);
      
      if (result.success) {
        // Set profile
        setUserProfile(profile);
        
        // If we have a session, set the token; otherwise proceed anyway
        if (authData.session?.access_token) {
          setAccessToken(authData.session.access_token);
        }
        
        // Always navigate to chatList after successful profile creation
        console.log("Navigating to chatList");
        setCurrentScreen("chatList");
      } else {
        throw new Error(result.error || "Failed to create profile");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      throw error;
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Provide a more helpful error message for unconfirmed emails
        if (error.message.includes('Email not confirmed')) {
          throw new Error('This account requires email confirmation. Please check your email or contact support. For this demo, try creating a new account which will auto-confirm.');
        }
        throw new Error(error.message);
      }

      if (authData?.session?.access_token) {
        setAccessToken(authData.session.access_token);
        
        // Load user profile
        const response = await fetch(`${API_URL}/profile/${authData.user.id}`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });
        const data = await response.json();
        
        if (data.success && data.profile) {
          setUserProfile(data.profile);
          await loadChats(data.profile.id);
          setCurrentScreen("chatList");
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const handleShowLogin = () => {
    setCurrentScreen("login");
  };

  const handleShowSignup = () => {
    setCurrentScreen("signup");
  };

  const handleBackToWelcome = () => {
    setCurrentScreen("welcome");
  };

  const handleNewRide = () => {
    setCurrentScreen("destination");
  };

  const handleSelectAirport = (airport: string) => {
    setSelectedAirport(airport);
    setCurrentScreen("preferences");
  };

  const handleSubmitPreferences = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    setCurrentScreen("matches");
  };

  const handleSelectMatch = async (match: Match) => {
    if (!userProfile) return;

    // Create a new chat with unique ID and include pickup time
    const newChat: Chat = {
      id: `${userProfile.id}_${match.id}`,
      match,
      lastMessage: "",
      lastMessageTime: new Date(),
      unreadCount: 0,
      isConfirmed: false,
      pickupTime: userPreferences?.departureTime || new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(newChat),
      });
      const data = await response.json();
      if (data.success) {
        setChats([...chats, newChat]);
        setSelectedMatch(match);
        setSelectedChat(newChat);
        setCurrentScreen("chat");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    // Remove chat from local state
    setChats(prevChats => prevChats.filter(c => c.id !== chatId));
  };

  const handleSelectChat = (chat: Chat) => {
    // Clear unread count locally
    setChats(prevChats => 
      prevChats.map(c => c.id === chat.id ? { ...c, unreadCount: 0 } : c)
    );
    setSelectedChat(chat);
    setSelectedMatch(chat.match);
    setCurrentScreen("chat");
  };

  const handleBackToDestination = () => {
    setCurrentScreen("destination");
    setSelectedAirport("");
    setUserPreferences(null);
  };

  const handleBackToPreferences = () => {
    setCurrentScreen("preferences");
    setUserPreferences(null);
  };

  const handleBackToMatches = () => {
    setCurrentScreen("matches");
    setSelectedMatch(null);
  };

  const handleBackToChatList = () => {
    setCurrentScreen("chatList");
    setSelectedChat(null);
    setSelectedMatch(null);
    if (userProfile) {
      loadChats(userProfile.id);
    }
  };

  const handleGoHome = () => {
    setCurrentScreen("chatList");
    setSelectedChat(null);
    setSelectedMatch(null);
    setSelectedAirport("");
    setUserPreferences(null);
  };

  const handleShowProfile = () => {
    setCurrentScreen("profile");
  };

  const handleUpdateProfile = async (updatedProfile: UserProfile) => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(updatedProfile),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setUserProfile(updatedProfile);
      } else {
        throw new Error(result.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setAccessToken(null);
      setUserProfile(null);
      setChats([]);
      setSelectedAirport("");
      setUserPreferences(null);
      setSelectedMatch(null);
      setSelectedChat(null);
      setRideRequests([]);
      setOutgoingRequests([]);
      setCurrentScreen("welcome");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleShowInbox = () => {
    setCurrentScreen("inbox");
  };

  const handleAcceptRequest = async (request: RideRequest) => {
    if (!userProfile) return;

    // Create a chat with the requester
    const newChat: Chat = {
      id: `${userProfile.id}_${request.requesterId}`,
      match: {
        id: request.requesterId,
        name: request.requesterName,
        initials: request.requesterInitials,
        pickupLocation: request.pickupLocation,
        distance: request.distance,
      },
      lastMessage: "",
      lastMessageTime: new Date(),
      unreadCount: 0,
      isConfirmed: false,
      pickupTime: request.departureTime,
    };

    try {
      // Save chat to backend
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(newChat),
      });
      const data = await response.json();
      
      if (data.success) {
        // Update ride request status to accepted
        setRideRequests(prevRequests =>
          prevRequests.map(r =>
            r.id === request.id ? { ...r, status: "accepted" as const } : r
          )
        );

        // Add chat to chats list
        setChats([...chats, newChat]);

        // Navigate back to chat list
        setCurrentScreen("chatList");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleRejectRequest = (requestId: string) => {
    // Update ride request status to rejected
    setRideRequests(prevRequests =>
      prevRequests.map(r =>
        r.id === requestId ? { ...r, status: "rejected" as const } : r
      )
    );
  };

  const handleCancelRequest = (requestId: string) => {
    // Remove outgoing request
    setOutgoingRequests(prevRequests =>
      prevRequests.filter(r => r.id !== requestId)
    );
  };

  return (
    <div className="min-h-screen">
      {currentScreen === "welcome" && (
        <Welcome onLogin={handleShowLogin} onSignup={handleShowSignup} />
      )}

      {currentScreen === "login" && (
        <Login onLogin={handleLogin} onBack={handleBackToWelcome} />
      )}

      {currentScreen === "signup" && (
        <ProfileCreation onSubmit={handleSignup} onBack={handleBackToWelcome} />
      )}

      {currentScreen === "chatList" && userProfile && (
        <ChatList
          userProfile={userProfile}
          chats={chats}
          onSelectChat={handleSelectChat}
          onNewRide={handleNewRide}
          onLogout={handleLogout}
          onProfile={handleShowProfile}
          onInbox={handleShowInbox}
          pendingRequestsCount={rideRequests.filter(r => r.status === "pending").length + outgoingRequests.filter(r => r.status === "pending").length}
          incomingRequests={rideRequests.filter(r => r.status === "pending")}
          outgoingRequests={outgoingRequests.filter(r => r.status === "pending")}
          onAcceptRequest={handleAcceptRequest}
          onRejectRequest={handleRejectRequest}
          onCancelRequest={handleCancelRequest}
        />
      )}

      {currentScreen === "destination" && (
        <DestinationSelection 
          onSelectAirport={handleSelectAirport} 
          onBack={handleBackToChatList}
          onHome={handleGoHome}
        />
      )}

      {currentScreen === "preferences" && userProfile && (
        <PreferencesForm
          airport={selectedAirport}
          userProfile={userProfile}
          onSubmit={handleSubmitPreferences}
          onBack={handleBackToDestination}
          onHome={handleGoHome}
        />
      )}

      {currentScreen === "matches" && userPreferences && userProfile && (
        <MatchResults
          airport={selectedAirport}
          preferences={userPreferences}
          userProfile={userProfile}
          onSelectMatch={handleSelectMatch}
          onBack={handleBackToPreferences}
          onHome={handleGoHome}
        />
      )}

      {currentScreen === "chat" && selectedMatch && selectedChat && userProfile && (
        <ChatView 
          match={selectedMatch} 
          chatId={selectedChat.id}
          userId={userProfile.id}
          userProfile={userProfile}
          onBack={handleBackToChatList} 
          onHome={handleGoHome}
          onDeleteChat={handleDeleteChat}
        />
      )}

      {currentScreen === "profile" && userProfile && (
        <ProfilePage
          userProfile={userProfile}
          onBack={handleBackToChatList}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {currentScreen === "inbox" && userProfile && (
        <Inbox
          requests={rideRequests}
          onAcceptRequest={handleAcceptRequest}
          onRejectRequest={handleRejectRequest}
          onCancelRequest={handleCancelRequest}
          onBack={handleBackToChatList}
        />
      )}
    </div>
  );
}