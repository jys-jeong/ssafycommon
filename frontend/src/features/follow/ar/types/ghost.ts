// types/ghost.ts
export const movementPatterns = [
  "random-jump",
  "smooth-slide",
  "circular",
  "zigzag",
  "bounce",
  "pause",
  "spiral",
  "shake",
] as const;
export type MovementPattern = (typeof movementPatterns)[number];

export type GhostBase = {
  src: string;
  pos: { x: number; y: number };
  size: number;
  rotation: number;
  hue: number;
  speed: number; // ms
  anim: boolean;
  title?: string;
};

export type GhostOrientationFixed = GhostBase & {
  type: "orientation-fixed";
  targetAlpha: number;
  targetBeta: number;
  tolerance: number;
};

export type GhostGpsFixed = GhostBase & {
  type: "gps-fixed";
  gpsLat: number;
  gpsLon: number;
  maxVisibleDistance?: number;
  isFixed?: boolean;
};

export type GhostAlwaysVisible = GhostBase & {
  type: "always-visible";
};

export type GhostUnion =
  | GhostOrientationFixed
  | GhostGpsFixed
  | GhostAlwaysVisible;

export type UserLocation = { latitude: number; longitude: number };

export type UseGhostGameReturn = {
  ghosts: GhostUnion[];
  setGhosts: React.Dispatch<React.SetStateAction<GhostUnion[]>>;
  score: number;
  totalCaught: number;
  resetGame: (userLocation?: UserLocation) => void;
  catchGhost: (index: number) => void;
  movementPatterns: readonly MovementPattern[];
};
