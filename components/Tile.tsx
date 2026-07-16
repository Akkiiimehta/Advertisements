"use client";

import { useMemo, useRef } from "react";
import { MotionValue, motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Project, getThumbnailUrl } from "@/lib/projects";
import { GridConfig, TILE_OVERLAP, fisheyeCurve, tileJitter, wrapToNearest } from "@/lib/grid";

interface TileProps {
  project: Project;
  cellIndex: number;
  col: number;
  row: number;
  grid: GridConfig;
  dragX: MotionValue<number>;
  dragY: MotionValue<number>;
  tiltRX: MotionValue<number>;
  tiltRY: MotionValue<number>;
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
  tiltRX,
  tiltRY,
  showTitleCard,
  isOpen,
  onOpen,
}: TileProps) {
  const { cols, rows, tileW, tileH } = grid;
  const gridW = cols * tileW;
  const gridH = rows * tileH;
  const maxDist = Math.max(gridW, gridH) / 2;

  const baseX = (col - cols / 2) * tileW + tileW / 2;
  const baseY = (row - rows / 2) * tileH + tileH / 2;

  const jitter = useMemo(() => tileJitter(cellIndex), [cellIndex]);

  // Local hover-driven tilt, layered on top of drag tilt + fisheye curve.
  const hoverRX = useMotionValue(0);
  const hoverRY = useMotionValue(0);
  const hoverScale = useMotionValue(1);
  const hovering = useRef(false);

  const wrappedX = useTransform(dragX, (v) => wrapToNearest(baseX + v, gridW));
  const wrappedY = useTransform(dragY, (v) => wrapToNearest(baseY + v, gridH));

  const transform = useTransform(
    [wrappedX, wrappedY, tiltRX, tiltRY, hoverRX, hoverRY, hoverScale],
    (values) => {
      const [wx, wy, gtx, gty, hrx, hry, hs] = values as number[];
      const curve = fisheyeCurve(wx, wy, maxDist);
      const rotateX = jitter.rx + curve.extraRotate * -curve.dirY + gtx + hrx;
      const rotateY = jitter.ry + curve.extraRotate * curve.dirX + gty + hry;
      const rotateZ = jitter.rz;
      const scale = curve.scale * hs;
      return `translate3d(${wx}px, ${wy}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
    }
  );

  function handlePointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    animate(hoverRX, relY * -6, { type: "spring", stiffness: 200, damping: 20 });
    animate(hoverRY, relX * 6, { type: "spring", stiffness: 200, damping: 20 });
  }

  function handlePointerEnter() {
    hovering.current = true;
    animate(hoverScale, 1.035, { type: "spring", stiffness: 220, damping: 22 });
  }

  function handlePointerLeave() {
    hovering.current = false;
    animate(hoverRX, 0, { type: "spring", stiffness: 160, damping: 18 });
    animate(hoverRY, 0, { type: "spring", stiffness: 160, damping: 18 });
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
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onClick={() => onOpen(project, layoutId, cellIndex)}
          layoutId={layoutId}
          style={{ "--tile-tint": project.tintColor } as React.CSSProperties}
        >
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
          <div className="tile-tint" aria-hidden />
          <div className="tile-overlay">
            <div className="tile-row tile-row-top">
              <span className="tile-brand">{project.brand}</span>
            </div>
            <div className="tile-row tile-row-bottom">
              <div className="tile-bottom-left">
                <span className="tile-title">{project.title}</span>
                <div className="tile-tags">
                  {project.tags.slice(0, 2).map((tag) => (
                    <span className="tile-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className="tile-year">{project.year}</span>
            </div>
          </div>
        </motion.button>
      )}
    </motion.div>
  );
}
