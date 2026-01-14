interface Props {
  title: string;
  description: string;
  index: number;
}

const CARD_BACKGROUNDS = [
  "bg-primary/10",
  "bg-secondary/15",
  "bg-accent/20",
];

export default function HowItWorksCard({
  title,
  description,
  index,
}: Props) {
  const bgClass = CARD_BACKGROUNDS[index % CARD_BACKGROUNDS.length];

  return (
    <div
      className={`
        rounded-3xl p-6 space-y-3
        ${bgClass}
        shadow-[0_8px_30px_rgba(0,0,0,0.04)]
      `}
    >
      <p className="text-xs font-medium text-muted tracking-wide">
        STEP {index + 1}
      </p>

      <h3 className="text-lg font-semibold leading-snug">
        {title}
      </h3>

      <p className="text-muted text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
