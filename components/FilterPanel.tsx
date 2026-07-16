"use client";

import { motion } from "framer-motion";

interface FilterPanelProps {
  tags: string[];
  activeTags: string[];
  onToggle: (tag: string) => void;
  onClear: () => void;
  onClose: () => void;
}

export default function FilterPanel({ tags, activeTags, onToggle, onClear, onClose }: FilterPanelProps) {
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
          <button className="filter-clear" onClick={onClear} disabled={activeTags.length === 0}>
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
      </motion.div>
    </>
  );
}
