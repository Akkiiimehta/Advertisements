"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import IntroAnimation from "@/components/IntroAnimation";
import InfiniteGrid from "@/components/InfiniteGrid";
import ListView from "@/components/ListView";
import SiteChrome from "@/components/SiteChrome";
import FilterPanel from "@/components/FilterPanel";
import ProjectModal from "@/components/ProjectModal";
import InfoOverlay from "@/components/InfoOverlay";
import { ViewMode, NavItem } from "@/components/types";
import { allTags, projects, Project } from "@/lib/projects";
import { buildProjectGrid } from "@/lib/grid";
import { useGridConfig } from "@/hooks/useGridConfig";

export default function Home() {
  const [introDone, setIntroDone] = useState(false);
  const [view, setView] = useState<ViewMode>("grid");
  const [nav, setNav] = useState<NavItem>("work");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [selected, setSelected] = useState<{ project: Project; layoutId: string; cellIndex: number | null } | null>(
    null
  );

  const grid = useGridConfig();

  const filteredProjects = useMemo(() => {
    if (activeTags.length === 0) return projects;
    const filtered = projects.filter((p) => activeTags.some((t) => p.tags.includes(t)));
    // never show an empty grid — fall back to the full set if a filter
    // combination happens to match nothing
    return filtered.length > 0 ? filtered : projects;
  }, [activeTags]);

  // Precomputed once per filter/grid-size change so that neighboring cells
  // (including the wraparound seam) never land on the same brand — see
  // buildProjectGrid in lib/grid.ts.
  const projectGrid = useMemo(
    () => buildProjectGrid(filteredProjects, grid.cols, grid.rows),
    [filteredProjects, grid.cols, grid.rows]
  );

  const getProject = useCallback(
    (row: number, col: number) => projectGrid[row][col],
    [projectGrid]
  );

  function handleOpen(project: Project, layoutId: string, cellIndex: number | null = null) {
    setSelected({ project, layoutId, cellIndex });
  }

  function toggleTag(tag: string) {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function handleNavChange(item: NavItem) {
    setNav(item);
    if (item === "work") {
      // closing about/contact returns to whichever canvas view was active
    }
  }

  return (
    <main className="app-root">
      <AnimatePresence>{!introDone && <IntroAnimation onDone={() => setIntroDone(true)} />}</AnimatePresence>

      {introDone && (
        <>
          {view === "grid" ? (
            <InfiniteGrid
              grid={grid}
              getProject={getProject}
              dragEnabled={!selected && !filterOpen && nav === "work"}
              openCellIndex={selected?.cellIndex ?? null}
              onOpen={handleOpen}
            />
          ) : (
            <ListView projects={filteredProjects} onOpen={handleOpen} />
          )}

          <SiteChrome
            view={view}
            onViewChange={setView}
            onFilterClick={() => setFilterOpen((v) => !v)}
            activeFilterCount={activeTags.length}
            activeNav={nav}
            onNavChange={handleNavChange}
          />

          <AnimatePresence>
            {filterOpen && (
              <FilterPanel
                tags={allTags}
                activeTags={activeTags}
                onToggle={toggleTag}
                onClear={() => setActiveTags([])}
                onClose={() => setFilterOpen(false)}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {nav === "contact" && <InfoOverlay onClose={() => setNav("work")} />}
          </AnimatePresence>

          <AnimatePresence>
            {selected && (
              <ProjectModal
                project={selected.project}
                layoutId={selected.layoutId}
                onClose={() => setSelected(null)}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </main>
  );
}
