import raw from "@/data/projects.json";

export interface Project {
  id: string;
  youtubeId?: string;
  instagramUrl?: string;
  coverImage?: string;
  title: string;
  brand: string;
  role: string;
  roles?: string[];
  productionHouse: string;
  description: string;
  credits: string[];
  tags: string[];
  year: number;
  tintColor?: string;
}

// Fixed set of roles you can filter by — kept as an explicit list rather
// than derived from the data (like tags are), so the filter UI shows all
// five options immediately instead of only appearing once a project
// happens to use that value. Add a project's role(s) via its `roles`
// array in projects.json using these exact strings.
export const ROLE_OPTIONS = ["DA", "1st AD", "2nd AD", "Production Manager", "Associate Producer"] as const;

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
  roles: p.roles ?? [],
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
//
// coverImage overrides both — set it whenever the auto-generated YouTube
// thumbnail looks wrong for the grid (e.g. a vertical/Shorts video whose
// default thumbnail pads out the sides with a blurred, stretched copy of
// itself). This only changes what shows in the grid tile; the modal
// still plays the real video via getEmbedUrl, untouched by this field —
// so setting a cleaner grid thumbnail never affects playback.
export function getThumbnailUrl(project: Project): string | null {
  if (project.coverImage) return project.coverImage;
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
