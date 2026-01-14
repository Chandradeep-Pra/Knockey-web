interface DotsProps {
  direction?: "vertical" | "horizontal";
  size?: number;
  gap?: number;
  variant?: "normal" | "muted" | "highlight";
}

export default function Dots({
  direction = "vertical",
  size = 10,
  gap = 8,
  variant = "normal",
}: DotsProps) {
  const colors =
    variant === "muted"
      ? ["#A1A4C8", "#C3C6E5", "#E2E4F5"]
      : ["#6C63FF", "#9ED8DB", "#FFD6A5"];

  return (
    <div
      className="flex"
      style={{
        flexDirection: direction === "vertical" ? "column" : "row",
        gap,
      }}
    >
      {colors.map((color, i) => (
        <span
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: "999px",
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  );
}
