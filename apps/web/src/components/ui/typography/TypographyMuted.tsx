import { cn } from "@/lib/utils";

export function TypographyMuted({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>{text}</p>
  );
}
