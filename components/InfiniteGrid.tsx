"use client";

import { useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";
import Tile from "./Tile";
import { Project } from "@/lib/projects";
import { GridConfig, cellHash, clamp } from "@/lib/grid";

interface InfiniteGridProps {
  grid: GridConfig;
  getProject: (row: number, col: number) => Project;
  dragEnabled: boolean;
  openCellIndex: number | null;
  onOpen: (project: Project, layoutId: string, cellIndex: number) => void;
}

export default function InfiniteGrid({
  grid,
  getProject,
  dragEnabled,
  openCellIndex,
  onOpen,
}: InfiniteGridProps) {
  const { cols, rows } = grid;

  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // Drag-direction tilt: derived from pointer velocity, smoothed through a
  // spring so it eases toward the resting state as soon as the drag slows
  // down or stops — no per-frame React state involved.
  const velocityX = useVelocity(dragX);
  const velocityY = useVelocity(dragY);
  const smoothVX = useSpring(velocityX, { stiffness: 60, damping: 22, mass: 0.6 });
  const smoothVY = useSpring(velocityY, { stiffness: 60, damping: 22, mass: 0.6 });
  const tiltRX = useTransform(smoothVY, (v) => clamp(v * -0.0055, -7, 7));
  const tiltRY = useTransform(smoothVX, (v) => clamp(v * 0.0055, -7, 7));

  const cells = useMemo(() => {
    const list: { cellIndex: number; col: number; row: number }[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        list.push({ cellIndex: row * cols + col, col, row });
      }
    }
    return list;
  }, [cols, rows]);

  function handleWheel(e: React.WheelEvent) {
    if (!dragEnabled) return;
    dragX.set(dragX.get() - e.deltaX);
    dragY.set(dragY.get() - e.deltaY);
  }

  return (
    <div className="grid-viewport" onWheel={handleWheel}>
      {/* Invisible full-viewport surface that captures the drag gesture and
          drives the shared dragX/dragY motion values. It has no visible
          content of its own, so its own transform moving is harmless —
          every Tile subscribes to dragX/dragY independently and computes
          its own wrapped position. */}
      <motion.div
        className="grid-pan-surface"
        drag={dragEnabled}
        dragMomentum
        dragTransition={{ power: 0.42, timeConstant: 260, restDelta: 0.4 }}
        dragElastic={0}
        style={{ x: dragX, y: dragY }}
      />
      <div className="grid-tiles" style={{ perspective: 1400 }}>
        {cells.map(({ cellIndex, col, row }) => (
          <Tile
            key={cellIndex}
            cellIndex={cellIndex}
            col={col}
            row={row}
            grid={grid}
            project={getProject(row, col)}
            dragX={dragX}
            dragY={dragY}
            tiltRX={tiltRX}
            tiltRY={tiltRY}
            showTitleCard={cellHash(row, col, 5, 1) === 0}
            isOpen={cellIndex === openCellIndex}
            onOpen={onOpen}
          />
        ))}
      </div>
    </div>
  );
}
