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

app.put("/make-server-c63c7d45/profile", async (c) => {
  try {
    const profile = await c.req.json();
    const profileId = `profile_${profile.id}`;
    await kv.set(profileId, profile);
    return c.json({ success: true, profile });
  } catch (error) {
    console.log("Error updating profile:", error);
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
    let chats = chatsData || [];
    
    // Filter out chats that are past their deletion time (3 days after pickup)
    const now = new Date();
    const validChats = [];
    const chatsToDelete = [];
    
    for (const chat of chats) {
      // If chat has a pickupTime, check if it's past 3 days after pickup
      if (chat.pickupTime) {
        const pickupDate = new Date(chat.pickupTime);
        const threeDaysAfter = new Date(pickupDate.getTime() + (3 * 24 * 60 * 60 * 1000));
        
        if (now > threeDaysAfter) {
          // This chat should be deleted
          chatsToDelete.push(chat);
        } else {
          validChats.push(chat);
        }
      } else {
        // No pickup time set, keep the chat
        validChats.push(chat);
      }
    }
    
    // Delete expired chats
    for (const chat of chatsToDelete) {
      const chatId = `chat_${chat.id}`;
      await kv.del(chatId);
      
      // Delete associated messages
      const messagesData = await kv.getByPrefix(`message_${chat.id}_`);
      if (messagesData && messagesData.length > 0) {
        const messageKeys = messagesData.map((msg: any) => `message_${msg.chatId}_${msg.id}`);
        await kv.mdel(messageKeys);
      }
    }
    
    return c.json({ success: true, chats: validChats });
  } catch (error) {
    console.log("Error fetching chats:", error);
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

// Delete chat endpoint
app.delete("/make-server-c63c7d45/chat/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const chatId = `chat_${id}`;
    
    // Delete the chat
    await kv.del(chatId);
    
    // Delete associated messages
    const messagesData = await kv.getByPrefix(`message_${id}_`);
    if (messagesData && messagesData.length > 0) {
      const messageKeys = messagesData.map((msg: any) => `message_${msg.chatId}_${msg.id}`);
      await kv.mdel(messageKeys);
    }
    
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

Deno.serve(app.fetch);