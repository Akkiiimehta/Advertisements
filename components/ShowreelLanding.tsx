"use client";

import { motion } from "framer-motion";
import ShowreelHero from "./ShowreelHero";
import ShowreelGrid from "./ShowreelGrid";
import ShowreelChrome from "./ShowreelChrome";
import ShowreelNudgePopup from "./ShowreelNudgePopup";
// Brand-grouped horizontal-scroll rows — parked for now since there
// are only a handful of projects per brand, which makes separate rows
// feel emptier than one unified grid. Once the catalog grows, swap
// ShowreelGrid below back out for ShowreelRows to re-enable them.
// import ShowreelRows from "./ShowreelRows";
import { Project, projects, getFeaturedProjects } from "@/lib/projects";

interface ShowreelLandingProps {
  onOpen: (project: Project, layoutId: string) => void;
  onEnterArchive: () => void;
  onContactClick: () => void;
}

const featured = getFeaturedProjects(projects, 5);

// Number of shot/in-post projects not yet public — shown as an empty
// teaser card at the end of the grid. Bump this as the pipeline moves.
const UPCOMING_PROJECTS_COUNT = 9;

export default function ShowreelLanding({ onOpen, onEnterArchive, onContactClick }: ShowreelLandingProps) {
  return (
    <motion.div
      className="showreel-landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <ShowreelChrome
        onEnterArchive={onEnterArchive}
        onContactClick={onContactClick}
        totalCount={projects.length}
      />

      <ShowreelHero projects={featured} onOpen={onOpen} />

      {/* <ShowreelRows projects={projects} onOpen={onOpen} /> */}
      <ShowreelGrid projects={projects} onOpen={onOpen} upcomingCount={UPCOMING_PROJECTS_COUNT} />

      <div className="showreel-enter">
        <button type="button" className="showreel-enter-btn" onClick={onEnterArchive}>
          Explore the full archive
          <span aria-hidden>&darr;</span>
        </button>
      </div>

      <ShowreelNudgePopup onEnterArchive={onEnterArchive} />
    </motion.div>
  );
}
