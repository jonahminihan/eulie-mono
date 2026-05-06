import { cn } from "@/lib/utils";

export function TypographySmall({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <small className={cn("text-sm leading-none font-medium", className)}>
      {text}
    </small>
  );
}
