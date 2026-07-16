"use client";

import { Project } from "@/lib/projects";

interface ListViewProps {
  projects: Project[];
  onOpen: (project: Project, layoutId: string) => void;
}

export default function ListView({ projects, onOpen }: ListViewProps) {
  return (
    <div className="list-view">
      <div className="list-view-inner">
        <p className="list-view-heading">Work — {projects.length} projects</p>
        <ul className="list-view-items">
          {projects.map((project, i) => (
            <li key={project.id} className="list-view-item">
              <button
                className="list-view-row"
                onClick={() => onOpen(project, `list-${project.id}`)}
              >
                <span className="list-view-index">{String(i + 1).padStart(2, "0")}</span>
                <span className="list-view-titleblock">
                  <span className="list-view-title">{project.title}</span>
                  <span className="list-view-brand">{project.brand}</span>
                </span>
                <span className="list-view-tags">{project.tags.join(", ")}</span>
                <span className="list-view-year">{project.year}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
