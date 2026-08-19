"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import IntroAnimation, { INTRO_STORAGE_KEY } from "@/components/IntroAnimation";
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
  const router = useRouter();

  // Fires immediately on mount, independent of the intro animation or
  // SiteChrome's own mount time. The nav's <Link href="/about"> already
  // prefetches on its own, but it doesn't exist in the DOM until AFTER
  // the intro finishes — so relying on that alone means prefetch can't
  // even start until someone's already looking at the nav, leaving very
  // little head start before a quick click. Starting it here instead
  // means the download has been running in the background since the
  // moment the site loaded.
  useEffect(() => {
    router.prefetch("/about");
  }, [router]);

  const [introDone, setIntroDone] = useState(false);

  // Checked in an effect — NOT in the useState initializer above —
  // deliberately. This app is statically exported, so the server-built
  // HTML always has no sessionStorage to check and therefore always
  // renders with the intro showing. If the initializer above read
  // sessionStorage directly, a returning visitor's very first client
  // render would skip the intro immediately, producing a DOM that
  // structurally differs from what the server built (the whole
  // InfiniteGrid/chrome block present vs. absent) — a hydration
  // mismatch, not just a cosmetic flash. Running this check in an
  // effect means it only ever fires after hydration has already
  // reconciled successfully against the server's output, so the first
  // render always matches, and this is just a fast follow-up update.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(INTRO_STORAGE_KEY) === "1") setIntroDone(true);
    } catch {
      // sessionStorage unavailable (e.g. privacy mode) — just show the intro
    }
  }, []);

  const [view, setView] = useState<ViewMode>("grid");
  const [nav, setNav] = useState<NavItem>("work");

  // The About page's "Get in touch" link points to "/#contact" — this
  // is what actually reads that hash and opens the contact overlay.
  // Without it, that link just lands back on the grid with nothing
  // happening, since `nav` otherwise always starts as "work" regardless
  // of the URL. Checked in an effect (not read directly into the
  // useState above) for the same hydration-safety reason as the intro
  // check above: window.location doesn't exist during the static
  // export's server build, so the first render always has to match
  // that "work" default, then update immediately after.
  useEffect(() => {
    if (window.location.hash === "#contact") setNav("contact");
  }, []);

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
          <motion.div
            className="hero-reveal"
            initial={{ opacity: 0, scale: 1.08, filter: "blur(18px) brightness(0.4)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px) brightness(1)" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
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
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.25 }}>
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
          </motion.div>

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
