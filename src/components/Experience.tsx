import { experience, skills } from "../content";
import { Inline } from "./Inline";

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading">
      <h2 id="experience-heading">Experience</h2>
      {experience.map((job) => (
        <article key={`${job.org}-${job.start}`} className="entry">
          <header className="entry-head">
            <h3>
              {job.role}, <span className="entry-org">{job.org}</span>
            </h3>
            <span className="meta">
              {job.start} – {job.end}
            </span>
          </header>
          <p>
            <Inline text={job.body} />
          </p>
          {job.stack && <p className="meta">{job.stack}</p>}
        </article>
      ))}

      <dl className="skills">
        {skills.map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.items}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
