// ghostUtils.ts
import type { GhostBase } from "./types/ghost";

export const IMAGE_OPTIONS = [
  "./donut.png",
  "./cookie.png",
  "./rollcake.png",
  "./pinkmacarong.png",
  "./malcha.png",
  "./pineappletart.png",
] as const;

export const randomBetween = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

export const createRandomGhost = (): GhostBase => ({
  src: IMAGE_OPTIONS[Math.floor(Math.random() * IMAGE_OPTIONS.length)],
  pos: { x: randomBetween(10, 90), y: randomBetween(10, 90) },
  size: randomBetween(100, 200),
  rotation: 0,
  hue: 0,
  speed: randomBetween(150, 800),
  anim: false,
});
