"use client";

interface BuiltProject {
  name: string;
  description: string;
  tags: string[];
  url: string | null; // null = no live link yet, card shows "Coming soon" instead
}

// Placeholder set — swap each entry's name/description/tags/url for the
// real thing whenever it's ready. url: null renders the card as
// "Coming soon" (no link, no hover-arrow) instead of a dead link.
const PROJECTS: BuiltProject[] = [
  {
    name: "Project One",
    description: "TODO — one line on what this actually is and does.",
    tags: ["TODO"],
    url: null,
  },
  {
    name: "Project Two",
    description: "TODO — one line on what this actually is and does.",
    tags: ["TODO"],
    url: null,
  },
  {
    name: "Project Three",
    description: "TODO — one line on what this actually is and does.",
    tags: ["TODO"],
    url: null,
  },
  {
    name: "Project Four",
    description: "TODO — one line on what this actually is and does.",
    tags: ["TODO"],
    url: null,
  },
];

export default function BuiltProjects() {
  return (
    <section className="built-projects" aria-label="Tools and systems I've built">
      <span className="built-projects-eyebrow">Also built</span>
      <h2 className="built-projects-heading">Tools I&rsquo;ve built along the way</h2>

      <div className="built-projects-grid">
        {PROJECTS.map((project, i) => {
          const inner = (
            <>
              <span className="built-project-index">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="built-project-name">{project.name}</h3>
              <p className="built-project-description">{project.description}</p>
              <div className="built-project-footer">
                <div className="built-project-tags">
                  {project.tags.map((tag) => (
                    <span className="built-project-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="built-project-cta">{project.url ? "View \u2192" : "Coming soon"}</span>
              </div>
            </>
          );

          return project.url ? (
            <a
              key={project.name}
              className="built-project-card"
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {inner}
            </a>
          ) : (
            <div key={project.name} className="built-project-card built-project-card-pending">
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}
