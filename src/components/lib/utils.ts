/* Minimal stand-in for the shadcn `cn` helper the Lightswind component imports.
   It only joins class names; there is no tailwind-merge here because nothing on
   this site passes conflicting utilities to it. */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}
