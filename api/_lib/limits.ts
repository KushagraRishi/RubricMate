/**
 * This demo runs on one personal API key, in public. These caps are what keep
 * a curious visitor from turning into a bill.
 */
export const LIMITS = {
  rubricChars: 15_000,
  draftChars: 25_000,
  questionChars: 600,
  historyTurns: 8,
  /**
   * Requests per IP per hour.
   *
   * A genuine session is roughly one extract, a few checks and a few
   * questions, so 20 locked people out after two honest goes. 40 leaves room
   * for that while still bounding the worst case: checking is the only call
   * that costs real money, at about 0.8c, so a single address cannot run up
   * more than about 30c an hour.
   */
  perWindow: 40,
  windowSeconds: 60 * 60,
};

/**
 * Best-effort per-IP rate limit.
 *
 * Upstash, when the env vars are set: shared across every serverless instance
 * and the only version that really holds. Without it we fall back to a Map in
 * the function's own memory, which catches a single visitor hammering a warm
 * instance and little else. That is a deliberate trade: the demo still works
 * with no store attached, and gets a real limit the moment one is.
 */
const memory = new Map<string, { count: number; resetAt: number }>();

export async function rateLimit(ip: string): Promise<{ ok: boolean; retryAfter?: number }> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    try {
      const key = `rubricmate:${ip}`;
      const res = await fetch(`${url}/pipeline`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' },
        body: JSON.stringify([
          ['INCR', key],
          ['EXPIRE', key, String(LIMITS.windowSeconds), 'NX'],
          ['TTL', key],
        ]),
      });
      const body = (await res.json()) as Array<{ result: number }>;
      const count = body[0]?.result ?? 0;
      const ttl = body[2]?.result ?? LIMITS.windowSeconds;
      if (count > LIMITS.perWindow) return { ok: false, retryAfter: ttl };
      return { ok: true };
    } catch {
      // A rate-limit store that is down must not take the demo down with it.
      return { ok: true };
    }
  }

  const now = Date.now();
  const hit = memory.get(ip);
  if (!hit || now > hit.resetAt) {
    memory.set(ip, { count: 1, resetAt: now + LIMITS.windowSeconds * 1000 });
    return { ok: true };
  }
  hit.count += 1;
  if (hit.count > LIMITS.perWindow) {
    return { ok: false, retryAfter: Math.ceil((hit.resetAt - now) / 1000) };
  }
  return { ok: true };
}
