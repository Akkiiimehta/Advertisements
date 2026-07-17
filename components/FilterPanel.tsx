"use client";

import { motion } from "framer-motion";

interface FilterPanelProps {
  tags: string[];
  activeTags: string[];
  onToggle: (tag: string) => void;
  roles: readonly string[];
  activeRoles: string[];
  onToggleRole: (role: string) => void;
  onClear: () => void;
  onClose: () => void;
}

export default function FilterPanel({
  tags,
  activeTags,
  onToggle,
  roles,
  activeRoles,
  onToggleRole,
  onClear,
  onClose,
}: FilterPanelProps) {
  const hasActive = activeTags.length > 0 || activeRoles.length > 0;

  return (
    <>
      <motion.div
        className="filter-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="filter-panel"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <div className="filter-panel-header">
          <span>Filter by category</span>
          <button className="filter-clear" onClick={onClear} disabled={!hasActive}>
            Clear
          </button>
        </div>
        <div className="filter-tags">
          {tags.map((tag) => (
            <button
              key={tag}
              className={`filter-tag ${activeTags.includes(tag) ? "active" : ""}`}
              onClick={() => onToggle(tag)}
              aria-pressed={activeTags.includes(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="filter-panel-header filter-panel-subheader">
          <span>Filter by role</span>
        </div>
        <div className="filter-tags">
          {roles.map((role) => (
            <button
              key={role}
              className={`filter-tag ${activeRoles.includes(role) ? "active" : ""}`}
              onClick={() => onToggleRole(role)}
              aria-pressed={activeRoles.includes(role)}
            >
              {role}
            </button>
          ))}
        </div>
      </motion.div>
    </>
  );
}
