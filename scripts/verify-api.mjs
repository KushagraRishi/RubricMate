/**
 * Loads every serverless entrypoint the way Vercel does, and fails if one
 * cannot be imported.
 *
 * This exists because of a real bug. The handlers were written with
 * extensionless relative imports, which Vite resolves happily in dev. The repo
 * is `"type": "module"`, so Node resolved nothing at all, and every function
 * died at module load with ERR_MODULE_NOT_FOUND before a line of handler code
 * ran -- a 500 with no log line to explain it. Dev was green the whole time.
 *
 * `npm run dev` cannot catch that, because Vite is the thing papering over it.
 * So this compiles api/ with tsc and imports the result under plain Node.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROUTES = ['extract', 'check', 'chat'];
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const api = join(root, 'api');

// Must live inside the project: the compiled code imports @anthropic-ai/sdk,
// and Node only finds it by walking up to this node_modules.
const out = join(root, '.api-verify');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

try {
  const tsconfig = join(out, 'tsconfig.json');
  writeFileSync(
    tsconfig,
    JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'bundler',
        strict: false,
        skipLibCheck: true,
        esModuleInterop: true,
        outDir: out,
        rootDir: api,
        types: ['node'],
      },
      include: [join(api, '**/*.ts')],
    }),
  );

  // tsc exits non-zero on the type-only import that reaches outside rootDir.
  // The emit is what matters here, so only a missing output is fatal.
  try {
    execFileSync('npx', ['tsc', '-p', tsconfig], { stdio: 'pipe' });
  } catch {
    /* emitted anyway */
  }

  // A key must be present or the client constructor throws for the wrong
  // reason; this never makes a request.
  process.env.ANTHROPIC_API_KEY ||= 'sk-ant-verify-only-not-a-real-key';

  for (const route of ROUTES) {
    const file = join(out, `${route}.js`);
    const mod = await import(pathToFileURL(file).href);
    if (typeof mod.default !== 'function') {
      throw new Error(`api/${route}.ts does not export a handler function`);
    }
    console.log(`  ok  api/${route}.ts loads under Node ESM`);
  }

  console.log('\nAll serverless entrypoints load. Safe to deploy.');
} catch (err) {
  console.error('\nAn API entrypoint failed to load the way Vercel loads it:\n');
  console.error(err instanceof Error ? err.message : err);
  console.error('\nThis would deploy as FUNCTION_INVOCATION_FAILED with no runtime log.');
  process.exitCode = 1;
} finally {
  rmSync(out, { recursive: true, force: true });
}
