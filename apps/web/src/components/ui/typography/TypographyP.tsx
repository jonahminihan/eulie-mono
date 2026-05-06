import { cn } from "@/lib/utils";

export function TypographyP({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <p
      className={cn("text-sm leading-7 [&:not(:first-child)]:mt-6", className)}
    >
      {text}
    </p>
  );
}
