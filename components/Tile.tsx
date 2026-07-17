"use client";

import { useRef } from "react";
import { MotionValue, motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Project, getThumbnailUrl } from "@/lib/projects";
import { GridConfig, TILE_OVERLAP, fisheyeCurve, wrapToNearest } from "@/lib/grid";

interface TileProps {
  project: Project;
  cellIndex: number;
  col: number;
  row: number;
  grid: GridConfig;
  dragX: MotionValue<number>;
  dragY: MotionValue<number>;
  showTitleCard: boolean;
  isOpen: boolean;
  onOpen: (project: Project, layoutId: string, cellIndex: number) => void;
}

export default function Tile({
  project,
  cellIndex,
  col,
  row,
  grid,
  dragX,
  dragY,
  showTitleCard,
  isOpen,
  onOpen,
}: TileProps) {
  const { cols, rows, tileW, tileH, curveDist } = grid;
  const gridW = cols * tileW;
  const gridH = rows * tileH;

  const baseX = (col - cols / 2) * tileW + tileW / 2;
  const baseY = (row - rows / 2) * tileH + tileH / 2;

  // Hover feedback is a soft scale bump only — no rotation/tilt.
  const hoverScale = useMotionValue(1);
  const hovering = useRef(false);

  const wrappedX = useTransform(dragX, (v) => wrapToNearest(baseX + v, gridW));
  const wrappedY = useTransform(dragY, (v) => wrapToNearest(baseY + v, gridH));

  const transform = useTransform([wrappedX, wrappedY, hoverScale], (values) => {
    const [wx, wy, hs] = values as number[];
    const curve = fisheyeCurve(wx, wy, curveDist);
    const rotateX = curve.extraRotate * -curve.dirY;
    const rotateY = curve.extraRotate * curve.dirX;
    const scale = curve.scale * hs;
    return `translate3d(${wx}px, ${wy}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
  });

  function handlePointerEnter() {
    hovering.current = true;
    animate(hoverScale, 1.03, { type: "spring", stiffness: 220, damping: 22 });
  }

  function handlePointerLeave() {
    hovering.current = false;
    animate(hoverScale, 1, { type: "spring", stiffness: 160, damping: 18 });
  }

  const layoutId = `tile-${cellIndex}`;
  const thumbnail = getThumbnailUrl(project);
  const useTitleCard = showTitleCard || !thumbnail;

  return (
    <motion.div
      className="tile-wrap"
      style={{
        position: "absolute",
        top: -TILE_OVERLAP / 2,
        left: -TILE_OVERLAP / 2,
        width: tileW + TILE_OVERLAP,
        height: tileH + TILE_OVERLAP,
        transform,
        willChange: "transform",
      }}
    >
      {isOpen ? (
        <div className="tile tile-placeholder" aria-hidden />
      ) : (
        <motion.button
          type="button"
          className="tile"
          aria-label={`Open ${project.title} for ${project.brand}`}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onClick={() => onOpen(project, layoutId, cellIndex)}
          layoutId={layoutId}
          style={{ "--tile-tint": project.tintColor } as React.CSSProperties}
        >
          <div className="tile-meta-top">
            <span className="tile-brand">{project.brand}</span>
            <span className="tile-name">{project.title}</span>
          </div>

          <div className="tile-media">
            {useTitleCard ? (
              <div className="tile-titlecard">
                <span className="tile-titlecard-brand">{project.brand}</span>
              </div>
            ) : (
              <img
                className="tile-thumb"
                src={thumbnail as string}
                alt=""
                draggable={false}
                loading="lazy"
              />
            )}
          </div>

          <div className="tile-meta-bottom">
            <div className="tile-tags">
              {project.tags.slice(0, 2).map((tag) => (
                <span className="tile-tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <span className="tile-year">{project.year}</span>
          </div>
        </motion.button>
      )}
    </motion.div>
  );
}
