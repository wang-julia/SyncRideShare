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
  participants?: string[];
  participantProfiles?: Record<string, { name: string; initials: string }>;
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
  acceptedByName?: string;
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

  const loadRideRequests = async (currentUserId: string) => {
    try {
      const response = await fetch(`${API_URL}/ride-requests`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      const data = await response.json();
      if (!data.success) {
        console.error("Failed to load ride requests:", data.error);
        setRideRequests([]);
        setOutgoingRequests([]);
        return;
      }

      const allRequests = (data.requests || []).filter((request: any) => request.userId);

      const incomingMap = new Map<string, any>();
      for (const request of allRequests) {
        if (request.userId === currentUserId) continue;
        if (request.status && request.status !== "pending") continue;
        const existing = incomingMap.get(request.userId);
        if (!existing) {
          incomingMap.set(request.userId, request);
          continue;
        }
        const existingTime = new Date(existing.createdAt ?? existing.departureTime).getTime();
        const requestTime = new Date(request.createdAt ?? request.departureTime).getTime();
        if (requestTime > existingTime) {
          incomingMap.set(request.userId, request);
        }
      }

      const requests = Array.from(incomingMap.values()).map((request: any) => ({
        id: request.id,
        requesterId: request.userId,
        requesterName: request.userName,
        requesterInitials: request.userInitials || request.userName.split(" ").map((part: string) => part[0]).join(""),
        requesterAge: request.userAge ?? 0,
        requesterGender: request.userGender,
        pickupLocation: request.pickupLocation,
        destination: request.airport,
        departureTime: request.departureTime,
        distance: "—",
        baggageSize: request.baggageSize ?? "Medium",
        status: request.status ?? "pending",
        timestamp: new Date(request.createdAt ?? Date.now()),
      }));

      let latestOutgoing: any = null;
      for (const request of allRequests) {
        if (request.userId !== currentUserId) continue;
        if (!latestOutgoing) {
          latestOutgoing = request;
          continue;
        }
        const existingTime = new Date(latestOutgoing.createdAt ?? latestOutgoing.departureTime).getTime();
        const requestTime = new Date(request.createdAt ?? request.departureTime).getTime();
        if (requestTime > existingTime) {
          latestOutgoing = request;
        }
      }

      const outgoing = latestOutgoing
        ? [{
            id: latestOutgoing.id,
            recipientId: "public",
            recipientName: "Public request",
            recipientInitials: "PR",
            destination: latestOutgoing.airport,
            departureTime: latestOutgoing.departureTime,
            status: latestOutgoing.status ?? "pending",
            acceptedByName: latestOutgoing.acceptedByName,
            timestamp: new Date(latestOutgoing.createdAt ?? Date.now()),
          }]
        : [];

      setRideRequests(requests);
      setOutgoingRequests(outgoing);
    } catch (error) {
      console.error("Error loading ride requests:", error);
      setRideRequests([]);
      setOutgoingRequests([]);
    }
  };

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
            await loadRideRequests(data.profile.id);
            
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

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token) {
        setAccessToken(session.access_token);
      } else if (event === "SIGNED_OUT") {
        setAccessToken(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
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

          const normalizedChats = await Promise.all(parsedChats.map(async (chat: any) => {
            if (!chat.participants || chat.match?.id !== userId) {
              return chat;
            }

            const otherId = chat.participants.find((id: string) => id !== userId);
            if (!otherId) {
              return chat;
            }

            const participantProfiles = chat.participantProfiles || {};
            const otherProfile = participantProfiles[otherId];
            if (otherProfile) {
              return {
                ...chat,
                match: {
                  ...chat.match,
                  id: otherId,
                  name: otherProfile.name,
                  initials: otherProfile.initials,
                },
              };
            }

            try {
              const profileResponse = await fetch(`${API_URL}/profile/${otherId}`, {
                headers: {
                  'Authorization': `Bearer ${publicAnonKey}`,
                },
              });
              const profileData = await profileResponse.json();
              if (profileData.success && profileData.profile) {
                const name = profileData.profile.name || "Ride Partner";
                const initials = name.split(" ").map((part: string) => part[0]).join("").slice(0, 2).toUpperCase();
                return {
                  ...chat,
                  match: {
                    ...chat.match,
                    id: otherId,
                    name,
                    initials,
                  },
                };
              }
            } catch (error) {
              console.error("Error loading other profile:", error);
            }

            return {
              ...chat,
              match: {
                ...chat.match,
                id: otherId,
                name: "Ride Partner",
                initials: "RP",
              },
            };
          }));

          const enrichedChats = await Promise.all(normalizedChats.map(async (chat: any) => {
            if (chat.lastMessage) {
              return chat;
            }
            try {
              const messagesResponse = await fetch(`${API_URL}/messages/${chat.id}`, {
                headers: {
                  'Authorization': `Bearer ${publicAnonKey}`,
                },
              });
              const messagesData = await messagesResponse.json();
              if (messagesData.success && messagesData.messages?.length) {
                const sortedMessages = [...messagesData.messages].sort((a: any, b: any) => {
                  const aTime = new Date(a.timestamp).getTime();
                  const bTime = new Date(b.timestamp).getTime();
                  return aTime - bTime;
                });
                const lastMessage = sortedMessages[sortedMessages.length - 1];
                return {
                  ...chat,
                  lastMessage: lastMessage.message,
                  lastMessageTime: new Date(lastMessage.timestamp),
                };
              }
            } catch (error) {
              console.error("Error loading last message:", error);
            }
            return chat;
          }));

          // Sort chats by most recent message first
          enrichedChats.sort((a: Chat, b: Chat) => 
            b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
          );
          setChats(prevChats => {
            const prevById = new Map(prevChats.map(chat => [chat.id, chat]));
            const merged = enrichedChats.map(chat => {
              const prev = prevById.get(chat.id);
              if (!prev) return chat;
              const prevTime = prev.lastMessageTime?.getTime?.() ?? 0;
              const serverTime = chat.lastMessageTime?.getTime?.() ?? 0;
              return prevTime > serverTime ? prev : chat;
            });
            const serverIds = new Set(enrichedChats.map(chat => chat.id));
            merged.push(...prevChats.filter(chat => !serverIds.has(chat.id)));
            return merged;
          });
        } else {
          // No chats found from server; keep existing local chats
          setChats(prevChats => prevChats);
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
        
        // Ensure a session is persisted for login
        if (authData.session?.access_token) {
          setAccessToken(authData.session.access_token);
        } else {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          });
          if (signInError) {
            console.error("Auto login after signup failed:", signInError);
          } else if (signInData.session?.access_token) {
            setAccessToken(signInData.session.access_token);
          }
        }
        
        // Always navigate to chatList after successful profile creation
        console.log("Navigating to chatList");
        await loadRideRequests(profile.id);
        setCurrentScreen("chatList");
      } else {
        throw new Error(result.error || "Failed to create profile");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      throw error;
    }
  };

  const ensureProfile = async (userId: string, email: string) => {
    try {
      const response = await fetch(`${API_URL}/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      const data = await response.json();
      if (data.success && data.profile) {
        return data.profile as UserProfile;
      }

      const nameFromEmail = email.split("@")[0].replace(/[._-]+/g, " ");
      const inferredName = nameFromEmail
        .split(" ")
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
        .trim() || "Student";

      const fallbackProfile: UserProfile = {
        id: userId,
        name: inferredName,
        email,
        age: 0,
        gender: "not-specified",
        phoneNumber: "",
      };

      const createResponse = await fetch(`${API_URL}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(fallbackProfile),
      });
      const createResult = await createResponse.json();
      if (createResult.success) {
        return fallbackProfile;
      }

      throw new Error(createResult.error || "Failed to create profile");
    } catch (error) {
      console.error("Error ensuring profile:", error);
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

        const profile = await ensureProfile(authData.user.id, email);
        setUserProfile(profile);
        await loadChats(profile.id);
        await loadRideRequests(profile.id);
        setCurrentScreen("chatList");
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
    const participants = [userProfile.id, match.id].sort();
    const newChat: Chat = {
      id: participants.join("_"),
      match,
      participants,
      participantProfiles: {
        [userProfile.id]: {
          name: userProfile.name,
          initials: userProfile.name.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase(),
        },
        [match.id]: {
          name: match.name,
          initials: match.initials,
        },
      },
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
      loadRideRequests(userProfile.id);
    }
  };

  const handleGoHome = () => {
    setCurrentScreen("chatList");
    setSelectedChat(null);
    setSelectedMatch(null);
    setSelectedAirport("");
    setUserPreferences(null);
    if (userProfile) {
      loadChats(userProfile.id);
      loadRideRequests(userProfile.id);
    }
  };

  useEffect(() => {
    if (currentScreen !== "chatList" || !userProfile) return;
    const intervalId = window.setInterval(() => {
      loadChats(userProfile.id);
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [currentScreen, userProfile?.id]);

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
    if (!userProfile) return;
    loadRideRequests(userProfile.id);
    setCurrentScreen("inbox");
  };

  const handleAcceptRequest = async (request: RideRequest) => {
    if (!userProfile) return;

    // Create a chat with the requester
    const participants = [userProfile.id, request.requesterId].sort();
    const newChat: Chat = {
      id: participants.join("_"),
      match: {
        id: request.requesterId,
        name: request.requesterName,
        initials: request.requesterInitials,
        pickupLocation: request.pickupLocation,
        distance: request.distance,
      },
      participants,
      participantProfiles: {
        [userProfile.id]: {
          name: userProfile.name,
          initials: userProfile.name.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase(),
        },
        [request.requesterId]: {
          name: request.requesterName,
          initials: request.requesterInitials,
        },
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
        await Promise.all([
          fetch(`${API_URL}/ride-request/${request.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({
              status: "accepted",
              acceptedById: userProfile.id,
              acceptedByName: userProfile.name,
              acceptedByInitials: userProfile.name.split(" ").map(part => part[0]).join(""),
              acceptedAt: new Date().toISOString(),
            }),
          }),
          fetch(`${API_URL}/ride-requests/${userProfile.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }),
        ]);

        await fetch(`${API_URL}/message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            id: Date.now().toString(),
            chatId: newChat.id,
            sender: "me",
            senderId: userProfile.id,
            message: "✅ Ride request accepted! This chat is now open.",
            timestamp: new Date(),
          }),
        });

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
