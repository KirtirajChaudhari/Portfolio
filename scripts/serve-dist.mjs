/* Serves dist/ the way the production host does: a file if it exists, a
   directory's index.html for a clean URL (/work -> work/index.html), and
   shell.html for everything else, with text compressed. `vite preview` always
   falls back to index.html, which hides the prerendered pages, so the specs
   and Lighthouse run against this.

     node scripts/serve-dist.mjs [port]      default 4173 */
import { createServer } from 'node:http';
import { brotliCompressSync, gzipSync } from 'node:zlib';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.argv[2] ?? 4173);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};
const isFile = async (p) => (await stat(p).catch(() => null))?.isFile() ?? false;
const TEXT = new Set(['.html', '.js', '.css', '.json', '.svg', '.txt', '.xml']);
const packed = new Map();

function compress(file, body, accepts) {
  const encoding = /\bbr\b/.test(accepts) ? 'br' : /\bgzip\b/.test(accepts) ? 'gzip' : '';
  if (!encoding || !TEXT.has(extname(file))) return { body };
  const key = `${encoding}:${file}`;
  if (!packed.has(key)) packed.set(key, encoding === 'br' ? brotliCompressSync(body) : gzipSync(body));
  return { body: packed.get(key), encoding };
}

createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/\/+$/, '');
  const candidates = [join(dist, path), join(dist, path, 'index.html'), join(dist, 'shell.html')];
  for (const file of candidates) {
    if (!file.startsWith(dist) || !(await isFile(file))) continue;
    const hashed = file.includes(`${join(dist, 'assets')}/`);
    const out = compress(file, await readFile(file), String(req.headers['accept-encoding'] ?? ''));
    res.writeHead(200, {
      'content-type': TYPES[extname(file)] ?? 'application/octet-stream',
      'cache-control': hashed ? 'public, max-age=31536000, immutable' : 'no-cache',
      ...(out.encoding ? { 'content-encoding': out.encoding, vary: 'accept-encoding' } : {}),
    });
    res.end(out.body);
    return;
  }
  res.writeHead(404).end('Not found');
}).listen(port, () => console.log(`dist on http://localhost:${port}`));
