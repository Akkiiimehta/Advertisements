import raw from "@/data/projects.json";

export interface Project {
  id: string;
  youtubeId?: string;
  instagramUrl?: string;
  title: string;
  brand: string;
  role: string;
  productionHouse: string;
  description: string;
  credits: string[];
  tags: string[];
  year: number;
  tintColor?: string;
}

// Auto-assigned accent palette used when a project doesn't specify its own
// tintColor. Keeps new entries from projects.json looking intentional
// without forcing every object to carry a color.
const PALETTE = [
  "#D6FF3F", // acid lime — primary accent
  "#6F5BFF", // indigo
  "#FF5B4A", // signal red
  "#FF9ECF", // pink
  "#FFB020", // amber
  "#2FD5B0", // teal
];

// projects.json keeps a `_template` key as a copy-paste example for adding
// new entries — strip anything that isn't inside the `projects` array.
const source = (raw as { projects: Project[] }).projects;

export const projects: Project[] = source.map((p, i) => ({
  ...p,
  tintColor: p.tintColor ?? PALETTE[i % PALETTE.length],
}));

export const totalProjects = projects.length;

export const allTags: string[] = Array.from(
  new Set(projects.flatMap((p) => p.tags))
).sort();

export function getProjectByCellIndex(cellIndex: number): Project {
  return projects[cellIndex % totalProjects];
}

// A project can point at a YouTube video (youtubeId) or an Instagram Reel/
// post (instagramUrl, e.g. "https://www.instagram.com/reel/Cxxxxxxxxx/").
// If both are set, YouTube wins for the thumbnail since it's the only one
// with a reliable public thumbnail URL.

export function getThumbnailUrl(project: Project): string | null {
  if (project.youtubeId) {
    return `https://img.youtube.com/vi/${project.youtubeId}/hqdefault.jpg`;
  }
  // Instagram doesn't expose a simple, tokenless public thumbnail URL, so
  // Instagram-only projects fall back to the title-card tile variant
  // instead (see Tile.tsx) rather than a broken/missing image.
  return null;
}

export function getEmbedUrl(project: Project): string {
  if (project.youtubeId) {
    return `https://www.youtube.com/embed/${project.youtubeId}?autoplay=1&mute=1&rel=0`;
  }
  if (project.instagramUrl) {
    const clean = project.instagramUrl.replace(/\/?(embed\/?)?$/, "");
    return `${clean}/embed/captioned`;
  }
  return "";
}
