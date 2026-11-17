/* Build step: render every professional route to static HTML.

   Runs after `vite build` (client, into dist/) and `vite build --ssr` (the
   server entry, into dist-ssr/). For each route it writes dist/<route>/index.html
   with the rendered markup, the stylesheet inlined, and that route's own title,
   description and URLs, so the page paints before any script runs and reads correctly to crawlers
   and link previews. dist/shell.html keeps the empty root for every other
   path (the legacy pages and the 404); vercel.json rewrites to it. */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const ORIGIN = 'https://kirtiraj-chaudhari.vercel.app';

const { render, routeMeta, PRERENDERED } = await import(pathToFileURL(join(root, 'dist-ssr/entry-server.js')).href);
const shell = await readFile(join(dist, 'index.html'), 'utf8');

/* The stylesheet is about 11 kB compressed. Prerendered pages carry it inline,
   so their first paint waits on one response instead of two. */
const sheet = shell.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/);
if (!sheet) throw new Error('prerender: stylesheet link not found in index.html');
const inlineCss = `<style>${(await readFile(join(dist, sheet[1]), 'utf8')).replace(/<\/style/gi, '<\\/style')}</style>`;

const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
function page(route, markup) {
  const meta = routeMeta(route);
  const url = ORIGIN + (route === '/' ? '/' : route);
  const swap = (html, pattern, value) => {
    if (!pattern.test(html)) throw new Error(`prerender: ${pattern} not found in index.html`);
    return html.replace(pattern, value);
  };
  let html = shell.replace(sheet[0], () => inlineCss);
  html = swap(html, /<title>[^<]*<\/title>/, `<title>${attr(meta.title)}</title>`);
  html = swap(html, /(<meta name="description" content=")[^"]*/, `$1${attr(meta.description)}`);
  html = swap(html, /(<link rel="canonical" href=")[^"]*/, `$1${url}`);
  html = swap(html, /(<meta property="og:url" content=")[^"]*/, `$1${url}`);
  html = swap(html, /(<meta property="og:title" content=")[^"]*/, `$1${attr(meta.title)}`);
  html = swap(html, /(<meta name="twitter:title" content=")[^"]*/, `$1${attr(meta.title)}`);
  if (route !== '/') {
    html = swap(html, /(<meta property="og:description" content=")[^"]*/, `$1${attr(meta.description)}`);
    html = swap(html, /(<meta name="twitter:description" content=")[^"]*/, `$1${attr(meta.description)}`);
  }
  return swap(html, /<div id="root"><\/div>/, `<div id="root" data-prerendered="${route}">${markup}</div>`);
}

await writeFile(join(dist, 'shell.html'), shell);
for (const route of PRERENDERED) {
  const file = route === '/' ? join(dist, 'index.html') : join(dist, route, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, page(route, await render(route)));
}
await rm(join(root, 'dist-ssr'), { recursive: true, force: true });
console.log(`prerendered ${PRERENDERED.length} routes`);
