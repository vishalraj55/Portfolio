import Groq from "groq-sdk";
import { CONTEXT } from "@/lib/context";

export const runtime = "edge";

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 1000;
const MAX_TOTAL_CONTENT_LENGTH = 6000;
const MAX_BODY_BYTES = 20_000;
const UPSTREAM_TIMEOUT_MS = 25_000;
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 8;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  if (entry.count > MAX_REQUESTS_PER_WINDOW) return true;
  return false;
}

function pruneRateLimitStore() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (now > entry.resetAt) rateLimitStore.delete(key);
  }
}

function errorResponse(status: number, message = "Error") {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function getClientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

function isAllowedOrigin(req: Request): boolean {
  const allowed = process.env.ALLOWED_ORIGIN;
  if (!allowed) return true; 

  const origin = req.headers.get("origin") ?? req.headers.get("referer");
  if (!origin) return false;

  return origin.startsWith(allowed);
}

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("[chat] Missing API_KEY");
    return errorResponse(500);
  }

  if (!isAllowedOrigin(req)) {
    return errorResponse(403, "Forbidden");
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return errorResponse(429, "Too many requests");
  }
  if (Math.random() < 0.01) pruneRateLimitStore();

  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return errorResponse(413, "Payload too large");
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse(400);
  }

  const messages = (body as { messages?: unknown })?.messages;

  if (!Array.isArray(messages) || messages.length === 0) {
    return errorResponse(400);
  }
  if (messages.length > MAX_MESSAGES) {
    return errorResponse(400);
  }

  let totalContentLength = 0;
  const isValid = messages.every((m) => {
    if (
      !m ||
      (m.role !== "user" && m.role !== "assistant") ||
      typeof m.content !== "string"
    ) {
      return false;
    }
    const trimmed = m.content.trim();
    if (trimmed.length === 0 || trimmed.length > MAX_MESSAGE_LENGTH) {
      return false;
    }
    totalContentLength += trimmed.length;
    return true;
  });
  if (!isValid || totalContentLength > MAX_TOTAL_CONTENT_LENGTH) {
    return errorResponse(400);
  }
  if (messages[messages.length - 1].role !== "user") {
    return errorResponse(400);
  }

  const upstreamController = new AbortController();
  const upstreamTimeout = setTimeout(
    () => upstreamController.abort(),
    UPSTREAM_TIMEOUT_MS,
  );

  try {
    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create(
      {
        model: "openai/gpt-oss-120b",
        messages: [{ role: "system", content: CONTEXT }, ...messages],
        temperature: 0.6,
        max_tokens: 400,
        stream: true,
      },
      { signal: upstreamController.signal },
    );

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) controller.enqueue(encoder.encode(text));
          }
        } catch (streamErr) {
          console.error("[chat] Stream error:", streamErr);
          controller.enqueue(encoder.encode("\n\n[Error]"));
        } finally {
          clearTimeout(upstreamTimeout);
          controller.close();
        }
      },
      cancel() {
        upstreamController.abort();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err: unknown) {
    clearTimeout(upstreamTimeout);
    console.error("[chat] Provider error:", err);
    const status =
      typeof err === "object" && err !== null && "status" in err
        ? Number((err as { status?: number }).status) || 500
        : 500;

    return errorResponse(status >= 400 && status < 600 ? status : 500);
  }
}