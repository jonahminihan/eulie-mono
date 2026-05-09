import { type JSX } from "react";

export function Code({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <code id="ui-code-block-body" className={className}>
      {children}
    </code>
  );
}
