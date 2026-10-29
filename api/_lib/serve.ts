import type { VercelRequest, VercelResponse } from '@vercel/node';
import { toErrorResult, type HandlerResult } from './handlers.js';
import { rateLimit } from './limits.js';

function clientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  if (Array.isArray(forwarded)) return forwarded[0];
  return req.socket?.remoteAddress ?? 'unknown';
}

/** Wraps a handler with the method check, the rate limit and error handling. */
export function serve(handler: (body: any) => Promise<HandlerResult>) {
  return async (req: VercelRequest, res: VercelResponse) => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Use POST.' });
      return;
    }

    const limit = await rateLimit(clientIp(req));
    if (!limit.ok) {
      res.setHeader('Retry-After', String(limit.retryAfter ?? 3600));
      res.status(429).json({
        error: "You've used up this hour's goes on the demo. It resets shortly.",
      });
      return;
    }

    let result: HandlerResult;
    try {
      result = await handler(req.body);
    } catch (err) {
      result = toErrorResult(err);
    }
    res.status(result.status).json(result.body);
  };
}
