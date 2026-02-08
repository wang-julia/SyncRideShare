import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();
const FLOWGLAD_API_BASE = "https://app.flowglad.com/api/v1";
const FLOWGLAD_PRICE_SLUG = Deno.env.get("FLOWGLAD_RIDE_SPLIT_PRICE_SLUG") ?? "";
const FLOWGLAD_ORG_ID = Deno.env.get("FLOWGLAD_ORGANIZATION_ID") ?? "";
const SNOWFLAKE_ACCOUNT = Deno.env.get("SNOWFLAKE_ACCOUNT") ?? "";
const SNOWFLAKE_HOST = Deno.env.get("SNOWFLAKE_HOST") ?? (SNOWFLAKE_ACCOUNT ? `${SNOWFLAKE_ACCOUNT}.snowflakecomputing.com` : "");
const SNOWFLAKE_OAUTH_TOKEN = Deno.env.get("SNOWFLAKE_OAUTH_TOKEN") ?? "";
const SNOWFLAKE_WAREHOUSE = (Deno.env.get("SNOWFLAKE_WAREHOUSE") ?? "COMPUTE_WH").trim();
const SNOWFLAKE_DATABASE = Deno.env.get("SNOWFLAKE_DATABASE") ?? "";
const SNOWFLAKE_SCHEMA = Deno.env.get("SNOWFLAKE_SCHEMA") ?? "";
const SNOWFLAKE_ROLE = Deno.env.get("SNOWFLAKE_ROLE") ?? "";
const SNOWFLAKE_ANALYTICS_TABLE = Deno.env.get("SNOWFLAKE_ANALYTICS_TABLE") ?? "RIDE_ANALYTICS";
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";
const GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") ?? "gemini-2.0-flash";

const escapeSqlLiteral = (value: string) => value.replace(/'/g, "''");

const getDayOfWeek = (date: Date) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[date.getDay()];
};

const snowflakeQuery = async (statement: string) => {
  if (!SNOWFLAKE_HOST || !SNOWFLAKE_OAUTH_TOKEN) {
    throw new Error("Snowflake connection not configured");
  }

  const url = `https://${SNOWFLAKE_HOST}/api/v2/statements`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SNOWFLAKE_OAUTH_TOKEN}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      statement,
      timeout: 60,
      warehouse: SNOWFLAKE_WAREHOUSE || undefined,
      database: SNOWFLAKE_DATABASE || undefined,
      schema: SNOWFLAKE_SCHEMA || undefined,
      role: SNOWFLAKE_ROLE || undefined,
    }),
  });

  const rawText = await response.text();
  let payload: any = null;
  try {
    payload = rawText ? JSON.parse(rawText) : {};
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const errorMessage = payload?.message || payload?.data?.error || payload?.error || rawText || "Snowflake query failed";
    throw new Error(`Snowflake ${response.status}: ${errorMessage}`);
  }
  if (!payload) {
    throw new Error("Snowflake returned a non-JSON response");
  }
  return payload;
};

const rowsToObjects = (payload: any) => {
  const columns = payload?.resultSetMetaData?.rowType || payload?.columns || [];
  const rows = payload?.data || [];
  if (!columns.length || !rows.length) return [];
  return rows.map((row: any[]) => {
    const obj: Record<string, any> = {};
    columns.forEach((col: any, idx: number) => {
      const name = col.name || col?.columnName || `col_${idx}`;
      obj[name.toLowerCase()] = row[idx];
    });
    return obj;
  });
};

const runCortex = async (prompt: string) => {
  const statement = `SELECT SNOWFLAKE.CORTEX.COMPLETE('gpt-4o-mini', $$${prompt}$$) AS response`;
  const payload = await snowflakeQuery(statement);
  const rows = rowsToObjects(payload);
  return rows[0]?.response || "";
};

const callGemini = async (question: string, conversation: Array<{ role: string; text: string }>) => {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured");
  }

  const convoText = conversation
    .slice(-6)
    .map((msg) => `${msg.role}: ${msg.text}`)
    .join("\n");

  const userPrompt = [
    "You are a helpful travel and rideshare assistant.",
    "Answer the user's question directly and concisely.",
    "Conversation:",
    convoText,
    "",
    `Question: ${question}`,
  ].join("\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      }),
    },
  );

  const payload = await response.json();
  if (!response.ok) {
    const errorMessage = payload?.error?.message || payload?.error?.status || "Gemini request failed";
    throw new Error(errorMessage);
  }

  const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
  return text || "No answer available.";
};

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
    if (Array.isArray(chat.participants)) {
      await Promise.all(
        chat.participants.map((participantId: string) =>
          kv.set(`chat_${participantId}_${chat.id}`, chat),
        ),
      );
    }
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
    if (Array.isArray(updatedChat.participants)) {
      await Promise.all(
        updatedChat.participants.map((participantId: string) =>
          kv.set(`chat_${participantId}_${id}`, updatedChat),
        ),
      );
    }
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
    const existingChat = await kv.get(chatId);
    await kv.del(chatId);
    if (existingChat && Array.isArray(existingChat.participants)) {
      const participantKeys = existingChat.participants.map((participantId: string) =>
        `chat_${participantId}_${id}`,
      );
      if (participantKeys.length > 0) {
        await kv.mdel(participantKeys);
      }
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
      if (Array.isArray(chat.participants)) {
        await Promise.all(
          chat.participants.map((participantId: string) =>
            kv.set(`chat_${participantId}_${message.chatId}`, chat),
          ),
        );
      }
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

// AI analytics endpoints (Snowflake Cortex)
app.get("/make-server-c63c7d45/ai/health", (c) => {
  return c.json({
    success: true,
    config: {
      host: SNOWFLAKE_HOST,
      database: SNOWFLAKE_DATABASE,
      schema: SNOWFLAKE_SCHEMA,
      table: SNOWFLAKE_ANALYTICS_TABLE,
      role: SNOWFLAKE_ROLE,
      warehouse: SNOWFLAKE_WAREHOUSE,
    },
  });
});

app.post("/make-server-c63c7d45/ai/optimizer", async (c) => {
  try {
    const { airport, pickupArea, pickupTime } = await c.req.json();
    if (!airport || !pickupTime) {
      return c.json({ success: false, error: "Missing airport or pickupTime" }, 400);
    }

    const pickupDate = new Date(pickupTime);
    if (Number.isNaN(pickupDate.getTime())) {
      return c.json({ success: false, error: "Invalid pickupTime" }, 400);
    }

    const dayOfWeek = getDayOfWeek(pickupDate);
    const hour = pickupDate.getHours();
    const airportSafe = escapeSqlLiteral(String(airport));
    const areaSafe = pickupArea ? escapeSqlLiteral(String(pickupArea)) : "";

    const areaFilter = areaSafe ? ` AND pickup_area = '${areaSafe}'` : "";
    const statement = `
      SELECT hour, AVG(success_rate) AS success_rate, SUM(ride_count) AS ride_count
      FROM ${SNOWFLAKE_ANALYTICS_TABLE}
      WHERE airport = '${airportSafe}'
        AND day_of_week = '${dayOfWeek}'
        ${areaFilter}
      GROUP BY hour
      ORDER BY hour
    `;

    const payload = await snowflakeQuery(statement);
    const rows = rowsToObjects(payload);
    if (!rows.length) {
      return c.json({ success: false, error: "No analytics data found" }, 404);
    }

    const byHour = new Map<number, { success_rate: number; ride_count: number }>();
    rows.forEach((row: any) => {
      byHour.set(Number(row.hour), {
        success_rate: Number(row.success_rate || 0),
        ride_count: Number(row.ride_count || 0),
      });
    });

    const baseline = byHour.get(hour) || { success_rate: 0, ride_count: 0 };
    const candidates = [hour - 1, hour, hour + 1].filter((h) => h >= 0 && h <= 23);
    let bestHour = hour;
    let bestRate = baseline.success_rate;
    candidates.forEach((h) => {
      const rate = byHour.get(h)?.success_rate ?? 0;
      if (rate > bestRate) {
        bestRate = rate;
        bestHour = h;
      }
    });

    const delta = baseline.success_rate > 0
      ? Math.round(((bestRate - baseline.success_rate) / baseline.success_rate) * 100)
      : 0;
    const minuteShift = Math.abs(bestHour - hour) * 60;
    const shiftLabel = minuteShift === 0 ? "right around now" : `${minuteShift} minutes ${bestHour > hour ? "later" : "earlier"}`;

    const summary = bestHour === hour
      ? `You're already near the best window. Staying around ${hour}:00 yields the highest match chance.`
      : `Leaving about ${shiftLabel} increases your match chances by ~${Math.abs(delta)}%.`;

    let aiText = "";
    try {
      const prompt = [
        "You are a ride-sharing analytics assistant. Respond in 2-3 concise sentences.",
        "Use only the provided stats.",
        `Airport: ${airportSafe}`,
        `Pickup area: ${pickupArea || "any"}`,
        `Day: ${dayOfWeek}`,
        `Requested hour: ${hour}`,
        `Baseline success rate: ${baseline.success_rate}`,
        `Best hour: ${bestHour}`,
        `Best success rate: ${bestRate}`,
        `Computed delta: ${delta}%`,
        `Summary: ${summary}`,
      ].join("\n");
      aiText = await runCortex(prompt);
    } catch (error) {
      console.log("Cortex error:", error);
    }

    return c.json({
      success: true,
      data: {
        dayOfWeek,
        hour,
        bestHour,
        baselineSuccessRate: baseline.success_rate,
        bestSuccessRate: bestRate,
        deltaPercent: delta,
        summary,
        aiText: aiText || summary,
      },
    });
  } catch (error) {
    console.log("Error running optimizer:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post("/make-server-c63c7d45/ai/ask", async (c) => {
  try {
    const { question, airport, pickupArea } = await c.req.json();
    if (!question || typeof question !== "string") {
      return c.json({ success: false, error: "Missing question" }, 400);
    }

    const q = question.toLowerCase();
    const airportSafe = airport ? escapeSqlLiteral(String(airport)) : "";
    const areaSafe = pickupArea ? escapeSqlLiteral(String(pickupArea)) : "";
    const areaFilter = areaSafe ? ` AND pickup_area = '${areaSafe}'` : "";
    const airportFilter = airportSafe ? ` AND airport = '${airportSafe}'` : "";

    let stats: any = {};
    if (q.includes("busiest")) {
      const statement = `
        SELECT day_of_week, hour, SUM(ride_count) AS ride_count
        FROM ${SNOWFLAKE_ANALYTICS_TABLE}
        WHERE 1=1 ${airportFilter} ${areaFilter}
        GROUP BY day_of_week, hour
        ORDER BY ride_count DESC
        LIMIT 1
      `;
      const payload = await snowflakeQuery(statement);
      stats = rowsToObjects(payload)[0] || {};
    } else if (q.includes("where do most rides go") || q.includes("most rides go")) {
      const statement = `
        SELECT airport, SUM(ride_count) AS ride_count
        FROM ${SNOWFLAKE_ANALYTICS_TABLE}
        WHERE 1=1 ${areaFilter}
        GROUP BY airport
        ORDER BY ride_count DESC
        LIMIT 3
      `;
      const payload = await snowflakeQuery(statement);
      stats = rowsToObjects(payload);
    } else if (q.includes("how likely") || q.includes("match")) {
      const timeMatch = q.match(/(\d{1,2})\s*(am|pm)/);
      const hour = timeMatch
        ? (Number(timeMatch[1]) % 12) + (timeMatch[2] === "pm" ? 12 : 0)
        : new Date().getHours();
      const statement = `
        SELECT day_of_week, hour, AVG(success_rate) AS success_rate
        FROM ${SNOWFLAKE_ANALYTICS_TABLE}
        WHERE hour = ${hour} ${airportFilter} ${areaFilter}
        GROUP BY day_of_week, hour
        ORDER BY success_rate DESC
        LIMIT 1
      `;
      const payload = await snowflakeQuery(statement);
      stats = rowsToObjects(payload)[0] || {};
    } else {
      const statement = `
        SELECT hour, AVG(success_rate) AS success_rate, SUM(ride_count) AS ride_count
        FROM ${SNOWFLAKE_ANALYTICS_TABLE}
        WHERE 1=1 ${airportFilter} ${areaFilter}
        GROUP BY hour
        ORDER BY ride_count DESC
        LIMIT 3
      `;
      const payload = await snowflakeQuery(statement);
      stats = rowsToObjects(payload);
    }

    let answer = "";
    try {
      const prompt = [
        "You are an analytics assistant. Answer the question using ONLY the provided stats.",
        `Question: ${question}`,
        `Stats: ${JSON.stringify(stats)}`,
      ].join("\n");
      answer = await runCortex(prompt);
    } catch (error) {
      console.log("Cortex error:", error);
    }

    return c.json({ success: true, data: { answer: answer || "No answer available.", stats } });
  } catch (error) {
    console.log("Error running AI assistant:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post("/make-server-c63c7d45/gemini/chat", async (c) => {
  try {
    const { question, messages } = await c.req.json();
    if (!question || typeof question !== "string") {
      return c.json({ success: false, error: "Missing question" }, 400);
    }

    const conversation = Array.isArray(messages)
      ? messages.map((msg) => ({
          role: msg.role === "assistant" ? "assistant" : "user",
          text: String(msg.text || ""),
        }))
      : [];

    const answer = await callGemini(question, conversation);
    return c.json({ success: true, data: { answer } });
  } catch (error) {
    console.log("Error running Gemini chat:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Flowglad checkout session endpoints
app.post("/make-server-c63c7d45/flowglad/checkout-session", async (c) => {
  try {
    const flowgladKey = Deno.env.get("FLOWGLAD_SECRET_KEY");
    if (!flowgladKey) {
      return c.json({ success: false, error: "Flowglad secret key not configured" }, 500);
    }

    const {
      customerExternalId,
      customerEmail,
      customerName,
      quantity,
      successUrl,
      cancelUrl,
      outputMetadata,
      outputName,
      priceSlug,
      anonymous,
    } = await c.req.json();

    if ((!anonymous && !customerExternalId) || !successUrl || !cancelUrl || !quantity || quantity <= 0) {
      return c.json({ success: false, error: "Missing required checkout session fields" }, 400);
    }

    const effectivePriceSlug = priceSlug || FLOWGLAD_PRICE_SLUG;
    const effectivePriceId = Deno.env.get("FLOWGLAD_RIDE_SPLIT_PRICE_ID") ?? "";
    if (!effectivePriceSlug && !effectivePriceId) {
      return c.json({ success: false, error: "Flowglad price not configured" }, 500);
    }

    if (anonymous) {
      const response = await fetch(`${FLOWGLAD_API_BASE}/checkout-sessions`, {
        method: "POST",
        headers: {
          "Authorization": flowgladKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          checkoutSession: {
            anonymous: true,
            successUrl,
            cancelUrl,
            type: "product",
            outputMetadata: outputMetadata ?? {},
            outputName,
            ...(effectivePriceId ? { priceId: effectivePriceId } : { priceSlug: effectivePriceSlug }),
            quantity,
          },
        }),
      });

      const rawText = await response.text();
      let data: any = null;
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        data = { error: rawText };
      }

      if (!response.ok) {
        console.log("Flowglad anonymous checkout error:", data);
        return c.json({ success: false, error: data }, response.status);
      }

      return c.json({
        success: true,
        ...data,
        checkoutSession: {
          ...(data?.checkoutSession ?? {}),
          url: data?.url,
        },
      });
    }

    const rawExternalId = String(customerExternalId);
    const customerKey = `flowglad_customer_${FLOWGLAD_ORG_ID || "default"}_${rawExternalId}`;
    const createCustomer = async (id: string, organizationId?: string) => {
      return fetch(`${FLOWGLAD_API_BASE}/customers`, {
        method: "POST",
        headers: {
          "Authorization": flowgladKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            externalId: id,
            email: customerEmail ?? "",
            name: customerName ?? "",
            organizationId,
          },
        }),
      });
    };

    const buildExternalId = (prefix?: string) =>
      prefix ? `${prefix}:${rawExternalId}:${crypto.randomUUID()}` : `${rawExternalId}:${crypto.randomUUID()}`;

    const createCheckout = async (externalId: string, organizationId?: string) => {
      return fetch(`${FLOWGLAD_API_BASE}/checkout-sessions`, {
        method: "POST",
        headers: {
          "Authorization": flowgladKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          checkoutSession: {
            customerExternalId: externalId,
            ...(organizationId ? { organizationId } : {}),
            successUrl,
            cancelUrl,
            type: "product",
            outputMetadata: outputMetadata ?? {},
            outputName,
            ...(effectivePriceId ? { priceId: effectivePriceId } : { priceSlug: effectivePriceSlug }),
            quantity,
          },
        }),
      });
    };

    const tryCreateAndCheckout = async (organizationId?: string) => {
      const externalId = buildExternalId(organizationId);
      const createResponse = await createCustomer(externalId, organizationId);
      if (!createResponse.ok) {
        const rawText = await createResponse.text();
        let data: any = null;
        try {
          data = rawText ? JSON.parse(rawText) : {};
        } catch {
          data = { error: rawText };
        }
        return { ok: false, status: createResponse.status, data };
      }
      await kv.set(customerKey, externalId);
      const checkoutResponse = await createCheckout(externalId, organizationId);
      const checkoutRaw = await checkoutResponse.text();
      let checkoutData: any = null;
      try {
        checkoutData = checkoutRaw ? JSON.parse(checkoutRaw) : {};
      } catch {
        checkoutData = { error: checkoutRaw };
      }
      return {
        ok: checkoutResponse.ok,
        status: checkoutResponse.status,
        data: checkoutData,
      };
    };

    let attempt = await tryCreateAndCheckout(FLOWGLAD_ORG_ID || undefined);
    if (!attempt.ok && attempt.status === 403 && FLOWGLAD_ORG_ID) {
      attempt = await tryCreateAndCheckout(undefined);
    }

    if (!attempt.ok) {
      console.log("Flowglad checkout session error:", attempt.data);
      return c.json({ success: false, error: attempt.data }, attempt.status);
    }

    return c.json({
      success: true,
      ...attempt.data,
      checkoutSession: {
        ...(attempt.data?.checkoutSession ?? {}),
        url: attempt.data?.url,
      },
    });
  } catch (error) {
    console.log("Error creating Flowglad checkout session:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get("/make-server-c63c7d45/flowglad/checkout-session/:id", async (c) => {
  try {
    const flowgladKey = Deno.env.get("FLOWGLAD_SECRET_KEY");
    if (!flowgladKey) {
      return c.json({ success: false, error: "Flowglad secret key not configured" }, 500);
    }

    const id = c.req.param("id");
    const response = await fetch(`${FLOWGLAD_API_BASE}/checkout-sessions/${id}`, {
      headers: {
        "Authorization": flowgladKey,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      console.log("Flowglad get checkout session error:", data);
      return c.json({ success: false, error: data }, response.status);
    }

    return c.json({ success: true, ...data });
  } catch (error) {
    console.log("Error fetching Flowglad checkout session:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Ride request endpoints
app.post("/make-server-c63c7d45/ride-request", async (c) => {
  try {
    const request = await c.req.json();
    const requestId = `ride_request_${request.userId}_${Date.now()}`;
    const requestWithId = {
      ...request,
      id: requestId,
      status: request.status ?? "pending",
      createdAt: new Date().toISOString(),
    };
    await kv.set(requestId, requestWithId);
    return c.json({ success: true, request: requestWithId });
  } catch (error) {
    console.log("Error creating ride request:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.put("/make-server-c63c7d45/ride-request/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    const existingRequest = await kv.get(id);
    if (!existingRequest) {
      return c.json({ success: false, error: "Ride request not found" }, 404);
    }
    const updatedRequest = { ...existingRequest, ...updates };
    await kv.set(id, updatedRequest);
    return c.json({ success: true, request: updatedRequest });
  } catch (error) {
    console.log("Error updating ride request:", error);
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

app.get("/make-server-c63c7d45/ride-requests", async (c) => {
  try {
    const requestsData = await kv.getByPrefix("ride_request_");
    const requests = requestsData || [];
    return c.json({ success: true, requests });
  } catch (error) {
    console.log("Error fetching all ride requests:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.delete("/make-server-c63c7d45/ride-requests/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const requestsData = await kv.getByPrefix(`ride_request_${userId}_`);
    const requestKeys = (requestsData || []).map((request: any) => request.id).filter(Boolean);
    if (requestKeys.length > 0) {
      await kv.mdel(requestKeys);
    }
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting ride requests:", error);
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
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    const hasOwnPending = allRequests.some((request: any) => {
      if (request.userId !== userId) return false;
      if (request.status !== "pending") return false;
      if (!request.createdAt) return false;
      const createdAtTime = new Date(request.createdAt).getTime();
      if (createdAtTime < now - oneDayMs) return false;
      const requestTime = new Date(request.departureTime).getTime();
      if (requestTime < now - 15 * 60 * 1000) return false;
      return true;
    });

    if (!hasOwnPending) {
      return c.json({ success: true, matches: [] });
    }
    
    // Filter matches based on criteria
    const filtered = allRequests.filter((request: any) => {
      // Don't match with yourself
      if (request.userId === userId) return false;

      if (request.status !== "pending") return false;
      
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

      // Ignore stale requests (older than 24h) or rides already in the past
      if (!request.createdAt) return false;
      const createdAtTime = new Date(request.createdAt).getTime();
      if (createdAtTime < now - oneDayMs) return false;
      if (requestTime < now - 15 * 60 * 1000) return false;
      
      return true;
    });

    // Deduplicate by requester (keep most recent)
    const deduped = new Map<string, any>();
    for (const request of filtered) {
      const existing = deduped.get(request.userId);
      if (!existing) {
        deduped.set(request.userId, request);
        continue;
      }
      const existingTime = new Date(existing.createdAt ?? existing.departureTime).getTime();
      const requestTime = new Date(request.createdAt ?? request.departureTime).getTime();
      if (requestTime > existingTime) {
        deduped.set(request.userId, request);
      }
    }
    
    return c.json({ success: true, matches: Array.from(deduped.values()) });
  } catch (error) {
    console.log("Error finding matches:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
