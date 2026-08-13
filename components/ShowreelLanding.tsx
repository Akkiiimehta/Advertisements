"use client";

import { motion } from "framer-motion";
import ShowreelHero from "./ShowreelHero";
import ShowreelRows from "./ShowreelRows";
import { Project, projects, getFeaturedProjects } from "@/lib/projects";

interface ShowreelLandingProps {
  onOpen: (project: Project, layoutId: string) => void;
  onEnterArchive: () => void;
}

const featured = getFeaturedProjects(projects, 5);

export default function ShowreelLanding({ onOpen, onEnterArchive }: ShowreelLandingProps) {
  return (
    <motion.div
      className="showreel-landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="showreel-topbar">
        <span className="wordmark">AKI</span>
      </div>

      <ShowreelHero projects={featured} onOpen={onOpen} />
      <ShowreelRows projects={projects} onOpen={onOpen} />

      <div className="showreel-enter">
        <button type="button" className="showreel-enter-btn" onClick={onEnterArchive}>
          Explore the full archive
          <span aria-hidden>&darr;</span>
        </button>
      </div>
    </motion.div>
  );
}
