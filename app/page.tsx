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
import { allTags, projects, Project, ROLE_OPTIONS } from "@/lib/projects";
import { buildGridAssignment } from "@/lib/grid";
import { useGridConfig } from "@/hooks/useGridConfig";

export default function Home() {
  const [introDone, setIntroDone] = useState(false);
  const [view, setView] = useState<ViewMode>("grid");
  const [nav, setNav] = useState<NavItem>("work");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [activeRoles, setActiveRoles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<{ project: Project; layoutId: string; cellIndex: number | null } | null>(
    null
  );

  const grid = useGridConfig();

  const filteredProjects = useMemo(() => {
    let result = projects;
    if (activeTags.length > 0) {
      const byTag = result.filter((p) => activeTags.some((t) => p.tags.includes(t)));
      if (byTag.length > 0) result = byTag;
    }
    if (activeRoles.length > 0) {
      const byRole = result.filter((p) => activeRoles.some((r) => p.roles?.includes(r)));
      if (byRole.length > 0) result = byRole;
    }
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      const bySearch = result.filter(
        (p) => p.brand.toLowerCase().includes(query) || p.title.toLowerCase().includes(query)
      );
      if (bySearch.length > 0) result = bySearch;
    }
    // never show an empty grid — fall back to the widest matching set
    // if the current filter/search combination happens to match nothing
    return result;
  }, [activeTags, activeRoles, searchQuery]);

  const assignment = useMemo(
    () => buildGridAssignment(grid.cols, grid.rows, filteredProjects),
    [grid.cols, grid.rows, filteredProjects]
  );

  const getProject = useCallback(
    (row: number, col: number) => filteredProjects[assignment[row * grid.cols + col]],
    [filteredProjects, assignment, grid.cols]
  );

  function handleOpen(project: Project, layoutId: string, cellIndex: number | null = null) {
    setSelected({ project, layoutId, cellIndex });
  }

  function toggleTag(tag: string) {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function toggleRole(role: string) {
    setActiveRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
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
            activeFilterCount={activeTags.length + activeRoles.length}
            activeNav={nav}
            onNavChange={handleNavChange}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <AnimatePresence>
            {filterOpen && (
              <FilterPanel
                tags={allTags}
                activeTags={activeTags}
                onToggle={toggleTag}
                roles={ROLE_OPTIONS}
                activeRoles={activeRoles}
                onToggleRole={toggleRole}
                onClear={() => {
                  setActiveTags([]);
                  setActiveRoles([]);
                }}
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
