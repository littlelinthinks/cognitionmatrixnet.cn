interface SectionHeaderProps {
  title: string;
  accentColor: "green" | "gold" | "blue";
  rightContent?: React.ReactNode;
}

const barColors = {
  green: "bg-neon-green",
  gold: "bg-gold",
  blue: "bg-neon-blue",
};

export default function SectionHeader({
  title,
  accentColor,
  rightContent,
}: SectionHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className={`h-10 w-1 rounded-full ${barColors[accentColor]}`} />
        <h2 className="text-section text-ink-primary">{title}</h2>
      </div>
      {rightContent && <div>{rightContent}</div>}
    </div>
  );
}
