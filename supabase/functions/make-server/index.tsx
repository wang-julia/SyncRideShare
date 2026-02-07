import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-c63c7d45/health", (c) => {
  return c.json({ status: "ok" });
});

// Profile endpoints
app.post("/make-server-c63c7d45/profile", async (c) => {
  try {
    const profile = await c.req.json();
    const profileId = `profile_${profile.id}`;
    await kv.set(profileId, profile);
    return c.json({ success: true, profile });
  } catch (error) {
    console.log("Error creating profile:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get("/make-server-c63c7d45/profile/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const profile = await kv.get(`profile_${id}`);
    if (!profile) {
      return c.json({ success: false, error: "Profile not found" }, 404);
    }
    return c.json({ success: true, profile });
  } catch (error) {
    console.log("Error fetching profile:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Chat endpoints
app.post("/make-server-c63c7d45/chat", async (c) => {
  try {
    const chat = await c.req.json();
    const chatId = `chat_${chat.id}`;
    await kv.set(chatId, chat);
    return c.json({ success: true, chat });
  } catch (error) {
    console.log("Error creating chat:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get("/make-server-c63c7d45/chats/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const chatsData = await kv.getByPrefix(`chat_${userId}_`);
    const chats = chatsData || [];
    return c.json({ success: true, chats });
  } catch (error) {
    console.log("Error fetching chats:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get("/make-server-c63c7d45/chat/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const chatId = `chat_${id}`;
    const chat = await kv.get(chatId);
    if (!chat) {
      return c.json({ success: false, error: "Chat not found" }, 404);
    }
    return c.json({ success: true, chat });
  } catch (error) {
    console.log("Error fetching chat:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.put("/make-server-c63c7d45/chat/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    const chatId = `chat_${id}`;
    const existingChat = await kv.get(chatId);
    if (!existingChat) {
      return c.json({ success: false, error: "Chat not found" }, 404);
    }
    const updatedChat = { ...existingChat, ...updates };
    await kv.set(chatId, updatedChat);
    return c.json({ success: true, chat: updatedChat });
  } catch (error) {
    console.log("Error updating chat:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.delete("/make-server-c63c7d45/chat/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const chatId = `chat_${id}`;
    
    // Delete all messages associated with this chat
    const messages = await kv.getByPrefix(`message_${id}_`);
    const messageKeys = messages.map((msg: any) => `message_${id}_${msg.id}`);
    if (messageKeys.length > 0) {
      await kv.mdel(messageKeys);
    }
    
    // Delete the chat itself
    await kv.del(chatId);
    
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting chat:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Message endpoints
app.post("/make-server-c63c7d45/message", async (c) => {
  try {
    const message = await c.req.json();
    const messageId = `message_${message.chatId}_${message.id}`;
    await kv.set(messageId, message);
    
    // Update chat's last message
    const chatId = `chat_${message.chatId}`;
    const chat = await kv.get(chatId);
    if (chat) {
      chat.lastMessage = message.message;
      chat.lastMessageTime = message.timestamp;
      await kv.set(chatId, chat);
    }
    
    return c.json({ success: true, message });
  } catch (error) {
    console.log("Error creating message:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get("/make-server-c63c7d45/messages/:chatId", async (c) => {
  try {
    const chatId = c.req.param("chatId");
    const messagesData = await kv.getByPrefix(`message_${chatId}_`);
    const messages = messagesData || [];
    return c.json({ success: true, messages });
  } catch (error) {
    console.log("Error fetching messages:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Ride request endpoints
app.post("/make-server-c63c7d45/ride-request", async (c) => {
  try {
    const request = await c.req.json();
    const requestId = `ride_request_${request.userId}_${Date.now()}`;
    const requestWithId = { ...request, id: requestId, createdAt: new Date().toISOString() };
    await kv.set(requestId, requestWithId);
    return c.json({ success: true, request: requestWithId });
  } catch (error) {
    console.log("Error creating ride request:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get("/make-server-c63c7d45/ride-requests/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const requestsData = await kv.getByPrefix(`ride_request_${userId}_`);
    const requests = requestsData || [];
    return c.json({ success: true, requests });
  } catch (error) {
    console.log("Error fetching ride requests:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Find matching ride requests
app.post("/make-server-c63c7d45/find-matches", async (c) => {
  try {
    const { airport, preferences, userId, userGender } = await c.req.json();
    
    // Get all ride requests
    const allRequestsData = await kv.getByPrefix("ride_request_");
    const allRequests = allRequestsData || [];
    
    // Filter matches based on criteria
    const matches = allRequests.filter((request: any) => {
      // Don't match with yourself
      if (request.userId === userId) return false;
      
      // Must be same airport
      if (request.airport !== airport) return false;
      
      // Check current user's gender preference
      if (preferences.genderPreference !== "no-preference" && 
          request.userGender !== preferences.genderPreference) {
        return false;
      }
      
      // Check if the other user's gender preference matches current user
      if (request.genderPreference !== "no-preference" && 
          request.genderPreference !== userGender) {
        return false;
      }
      
      // Check time window (within 2 hours)
      const userTime = new Date(preferences.departureTime).getTime();
      const requestTime = new Date(request.departureTime).getTime();
      const timeDiff = Math.abs(userTime - requestTime) / (1000 * 60); // minutes
      if (timeDiff > 120) return false; // more than 2 hours apart
      
      return true;
    });
    
    return c.json({ success: true, matches });
  } catch (error) {
    console.log("Error finding matches:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);