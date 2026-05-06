import { cn } from "@/lib/utils";

export function TypographyLarge({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return <div className={cn("text-md font-semibold", className)}>{text}</div>;
}
