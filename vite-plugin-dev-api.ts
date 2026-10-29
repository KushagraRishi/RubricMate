import type { Plugin, ViteDevServer } from 'vite';

/**
 * In production Vercel turns every file in /api into its own serverless
 * function. The dev server knows nothing about that, so this plugin mounts the
 * same handler modules on the same paths locally.
 *
 * The point is that what you verify on localhost is the code that ships -- the
 * handlers are imported, not reimplemented.
 */
export function devApi(): Plugin {
  return {
    name: 'rubricmate-dev-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];
        if (!url?.startsWith('/api/')) return next();

        const route = url.slice('/api/'.length);
        if (!/^(extract|check|chat)$/.test(route)) return next();

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify({ error: 'Use POST.' }));
          return;
        }

        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const raw = Buffer.concat(chunks).toString('utf8');
          const body = raw ? JSON.parse(raw) : {};

          const mod = await server.ssrLoadModule('/api/_lib/handlers.ts');
          const handler = {
            extract: mod.handleExtract,
            check: mod.handleCheck,
            chat: mod.handleChat,
          }[route]!;

          let result;
          try {
            result = await handler(body);
          } catch (err) {
            result = mod.toErrorResult(err);
          }

          res.statusCode = result.status;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify(result.body));
        } catch (err) {
          server.config.logger.error(`[dev-api] ${String(err)}`);
          res.statusCode = 500;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify({ error: 'Dev API failed. Check the terminal.' }));
        }
      });
    },
  };
}
