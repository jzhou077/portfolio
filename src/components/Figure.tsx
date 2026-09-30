import type { ReactNode } from "react";

type Props = { number: number; caption: ReactNode; wide?: boolean; children: ReactNode };

export function Figure({ number, caption, wide = false, children }: Props) {
  return (
    <figure className={`figure ${wide ? "figure-wide" : ""}`}>
      <div className="figure-frame">{children}</div>
      <figcaption>
        <span className="figure-label">Fig. {number}</span> {caption}
      </figcaption>
    </figure>
  );
}
