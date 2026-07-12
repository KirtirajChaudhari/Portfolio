interface SectionHeadingProps {
  overline?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  overline,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`mb-12 ${alignClass}`}>
      {overline && (
        <span className="mb-3 inline-block text-xs font-medium uppercase tracking-[0.2em] text-accent">
          {overline}
        </span>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight text-text sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
