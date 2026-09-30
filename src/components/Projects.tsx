import { profile, projects, type Project } from "../content";
import { Figure } from "./Figure";
import { Inline } from "./Inline";
import { Photo } from "./Photo";
import { PursuitHint, PursuitSim } from "./PursuitSim";

// Fig. 1 is the signal plot in the intro, so project figures start at 2.
const FIRST_FIGURE = 2;

function ProjectEntry({ project, figureNumber }: { project: Project; figureNumber: number }) {
  const { title, year, body, stack, repo, demo, note, photo, figure } = project;

  return (
    <article className="entry">
      <header className="entry-head">
        <h3>{title}</h3>
        <span className="meta">{year}</span>
      </header>

      <div className={photo ? "entry-with-photo" : undefined}>
        <div>
          <p>
            <Inline text={body} />
          </p>
          {note && <p className="note">{note}</p>}
          <p className="meta">
            {stack}
            {repo && (
              <>
                {" · "}
                <a href={`${profile.github}/${repo}`} target="_blank" rel="noopener">
                  code
                </a>
              </>
            )}
            {demo && (
              <>
                {" · "}
                <a href={demo} target="_blank" rel="noopener">
                  live
                </a>
              </>
            )}
          </p>
        </div>
        {photo && <Photo photo={photo} />}
      </div>

      {figure?.kind === "pursuit" && (
        <Figure
          number={figureNumber}
          caption={
            <>
              {figure.caption} <PursuitHint />
            </>
          }
          wide
        >
          <PursuitSim />
        </Figure>
      )}
    </article>
  );
}

export function Projects() {
  let nextFigure = FIRST_FIGURE;
  return (
    <section id="projects" aria-labelledby="projects-heading">
      <h2 id="projects-heading">Projects</h2>
      {projects.map((project) => (
        <ProjectEntry
          key={project.title}
          project={project}
          figureNumber={project.figure ? nextFigure++ : 0}
        />
      ))}
    </section>
  );
}
