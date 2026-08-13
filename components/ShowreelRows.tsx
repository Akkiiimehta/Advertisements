"use client";

import { motion } from "framer-motion";
import { Project, getThumbnailUrl, groupByBrand } from "@/lib/projects";

interface ShowreelRowsProps {
  projects: Project[];
  onOpen: (project: Project, layoutId: string) => void;
}

export default function ShowreelRows({ projects, onOpen }: ShowreelRowsProps) {
  const rows = groupByBrand(projects);

  return (
    <div className="showreel-rows">
      {rows.map((row) => (
        <section className="showreel-row" key={row.brand}>
          <h2 className="showreel-row-title">{row.brand}</h2>
          <div className="showreel-row-track">
            {row.items.map((project) => {
              const layoutId = `showreel-card-${project.id}`;
              const thumb = getThumbnailUrl(project);
              return (
                <motion.button
                  type="button"
                  key={project.id}
                  className="showreel-card"
                  layoutId={layoutId}
                  onClick={() => onOpen(project, layoutId)}
                  aria-label={`Open ${project.title} for ${project.brand}`}
                >
                  {/* Fixed box + object-fit: cover, deliberately unlike the
                      main grid's object-fit: contain — every card here
                      crops to the same uniform size regardless of the
                      source thumbnail's own aspect ratio or padding, which
                      is the whole point of a Netflix-style row. */}
                  <div className="showreel-card-media">
                    {thumb ? (
                      <img
                        className="showreel-card-thumb"
                        src={thumb}
                        alt=""
                        draggable={false}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="showreel-card-titlecard"
                        style={{ "--tile-tint": project.tintColor } as React.CSSProperties}
                      >
                        <span>{project.brand}</span>
                      </div>
                    )}
                  </div>
                  <div className="showreel-card-caption">
                    <span className="showreel-card-name">{project.title}</span>
                    <span className="showreel-card-year">{project.year}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
