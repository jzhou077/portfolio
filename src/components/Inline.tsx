import type { ReactNode } from "react";

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Renders a string from content.ts, turning [label](href) into links. */
export function Inline({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK)) {
    const [whole, label, href] = match;
    parts.push(text.slice(last, match.index));
    parts.push(
      <a key={match.index} href={href} {...(/^https?:/.test(href!) && { target: "_blank", rel: "noopener" })}>
        {label}
      </a>,
    );
    last = match.index + whole.length;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
}
