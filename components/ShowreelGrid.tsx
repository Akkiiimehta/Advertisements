"use client";

import { motion } from "framer-motion";
import { Project, getThumbnailUrl, getHiResThumbnailUrl } from "@/lib/projects";

interface ShowreelGridProps {
  projects: Project[];
  onOpen: (project: Project, layoutId: string) => void;
}

// Flat grid version of the showreel browse section — every project in
// one unified grid (4 per row on desktop) instead of split into
// horizontally-scrolling per-brand rows. Swap back to ShowreelRows in
// ShowreelLanding.tsx once there are enough projects per brand that
// separate rows are worth the extra scroll.
export default function ShowreelGrid({ projects, onOpen }: ShowreelGridProps) {
  return (
    <div className="showreel-grid">
      {projects.map((project) => {
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
            <div className="showreel-card-media">
              {thumb ? (
                <img
                  className="showreel-card-thumb"
                  src={getHiResThumbnailUrl(project) ?? thumb}
                  alt=""
                  draggable={false}
                  loading="lazy"
                  onError={(e) => {
                    // maxresdefault.jpg doesn't exist for every video —
                    // fall back to the guaranteed hqdefault instead of
                    // showing a broken image.
                    if (e.currentTarget.src !== thumb) e.currentTarget.src = thumb;
                  }}
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
  );
}
