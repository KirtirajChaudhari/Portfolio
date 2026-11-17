/** Adds a stylesheet link once. The legacy pages use it for their Google Fonts,
 *  so the professional pages never pay for faces they do not use. */
export function loadStylesheet(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

export const LEGACY_FONTS =
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Inter+Tight:wght@600&family=Antonio:wght@400;500;600;700&family=Spectral:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Caveat:wght@400;500;600;700&display=swap';
