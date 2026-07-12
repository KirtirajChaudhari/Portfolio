import { siteMeta } from "@/content/shared";
import { artisticReflections } from "@/content/artistic";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-4xl px-6 text-center">
        {/* Optional reflection/quote */}
        {artisticReflections.length > 0 && (
          <blockquote className="mb-8 text-sm italic text-text-muted">
            &ldquo;{artisticReflections[0].content}&rdquo;
          </blockquote>
        )}

        <p className="text-sm text-text-muted">
          © {year} {siteMeta.fullName}. Made with curiosity.
        </p>
      </div>
    </footer>
  );
}
