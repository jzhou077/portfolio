import { intro, profile, scopeCaption } from "../content";
import { Figure } from "./Figure";
import { Inline } from "./Inline";
import { Oscilloscope } from "./Oscilloscope";
import { Photo } from "./Photo";

export function Intro() {
  return (
    <section className="intro" aria-label="About me">
      <Photo photo={profile.photo} className="headshot" />
      {intro.map((paragraph) => (
        <p key={paragraph.slice(0, 20)}>
          <Inline text={paragraph} />
        </p>
      ))}
      <p className="links">
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <a href={profile.github} target="_blank" rel="noopener">
          GitHub
        </a>
        <a href={profile.linkedin} target="_blank" rel="noopener">
          LinkedIn
        </a>
        <a href={profile.resume} target="_blank" rel="noopener">
          Resume (PDF)
        </a>
      </p>

      <Figure number={1} caption={scopeCaption}>
        <Oscilloscope />
      </Figure>
    </section>
  );
}
