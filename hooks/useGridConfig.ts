"use client";

import { useEffect, useState } from "react";
import { DESKTOP_GRID, MOBILE_GRID, MOBILE_BREAKPOINT, GridConfig } from "@/lib/grid";

// Picks a lower-density virtual grid on small viewports to protect frame
// rate, per the responsive requirements in the brief. Defaults to the
// desktop config until mounted so static export has a stable first paint.
export function useGridConfig(): GridConfig {
  const [config, setConfig] = useState<GridConfig>(DESKTOP_GRID);

  useEffect(() => {
    const apply = () => {
      setConfig(window.innerWidth <= MOBILE_BREAKPOINT ? MOBILE_GRID : DESKTOP_GRID);
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  return config;
}
