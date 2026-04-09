type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  centered?: boolean;
  light?: boolean;
};

export function SectionHeading({ eyebrow, title, description, centered = false, light = false }: SectionHeadingProps) {
  return (
    <div className={`section-heading ${centered ? 'centered' : ''} ${light ? 'section-heading--light' : ''}`.trim()}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
