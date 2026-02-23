interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeading({ title, subtitle, className = '' }: SectionHeadingProps) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <h2 className="font-serif text-3xl md:text-4xl text-charcoal">{title}</h2>
      <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
      {subtitle && (
        <p className="mt-4 text-warm-gray max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}
