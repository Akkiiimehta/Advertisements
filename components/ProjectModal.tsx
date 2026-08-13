"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Project, getEmbedUrl } from "@/lib/projects";
import { useSound } from "./SoundProvider";

interface ProjectModalProps {
  project: Project;
  layoutId: string;
  onClose: () => void;
}

export default function ProjectModal({ project, layoutId, onClose }: ProjectModalProps) {
  const [creditsOpen, setCreditsOpen] = useState(false);
  const { duckAudio, unduckAudio } = useSound();

  // Runs once per mount (a new ProjectModal instance is created each
  // time a project opens) — pause background music for the entire time
  // this modal exists, resume it the moment it unmounts, regardless of
  // whether the project's own video actually played, was muted, etc.
  // Ducking on "modal is open" rather than "video is playing" is the
  // simpler and more reliable rule: we don't control the YouTube
  // iframe's internal play state, so we can't react to it directly.
  useEffect(() => {
    duckAudio();
    return () => unduckAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="modal-root">
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      />
      <motion.div
        className="modal-panel"
        layoutId={layoutId}
        transition={{ type: "spring", stiffness: 260, damping: 32, mass: 0.9 }}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close project">
          <span aria-hidden>&times;</span>
        </button>

        <div className="modal-scroll">
          <div className="modal-video-wrap">
            <iframe
              className="modal-video"
              src={getEmbedUrl(project)}
              title={project.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="modal-body">
            <h1 className="modal-title">{project.title}</h1>
            <p className="modal-brand">{project.brand}</p>

            <div className="modal-meta">
              <div className="modal-meta-row">
                <span className="modal-meta-label">Role</span>
                <span className="modal-meta-value">{project.role}</span>
              </div>
              {project.productionHouse && (
                <div className="modal-meta-row">
                  <span className="modal-meta-label">Production house</span>
                  <span className="modal-meta-value">{project.productionHouse}</span>
                </div>
              )}
              <div className="modal-meta-row">
                <span className="modal-meta-label">Year</span>
                <span className="modal-meta-value">{project.year}</span>
              </div>
            </div>

            <p className="modal-description">{project.description}</p>

            <div className="modal-tags">
              {project.tags.map((tag) => (
                <span className="modal-tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>

            {project.credits.length > 0 && (
              <div className="modal-credits">
                <button
                  className="modal-credits-toggle"
                  onClick={() => setCreditsOpen((v) => !v)}
                  aria-expanded={creditsOpen}
                >
                  {creditsOpen ? "Hide full credits" : "View full credits"}
                  <span className={`modal-credits-chevron ${creditsOpen ? "open" : ""}`} aria-hidden>
                    &#9662;
                  </span>
                </button>
                {creditsOpen && (
                  <ul className="modal-credits-list">
                    {project.credits.map((credit) => (
                      <li key={credit}>{credit}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
