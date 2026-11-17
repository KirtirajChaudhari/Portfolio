import { prerender } from 'react-dom/static';
import { StaticRouter } from 'react-router-dom';
import App from './App';

export { routeMeta, PRERENDERED } from './content/meta';

/** Renders one route to an HTML string, waiting for its lazy chunk. Build-time only (scripts/prerender.mjs). */
export async function render(url: string): Promise<string> {
  const { prelude } = await prerender(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
  return new Response(prelude).text();
}
