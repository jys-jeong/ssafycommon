// useGhostGame.ts
import { useState, useCallback, useEffect } from "react";
import { createRandomGhost } from "./ghostUtils";
import {
  movementPatterns,
  type UseGhostGameReturn,
  type GhostUnion,
  type GhostBase,
} from "./types/ghost";

export default function useGhostGame(): UseGhostGameReturn {
  const [ghosts, setGhosts] = useState<GhostUnion[]>([]);
  const [score, setScore] = useState(0);
  const [totalCaught, setTotalCaught] = useState(0);

  const resetGame = useCallback((userLocation?: { latitude: number; longitude: number }) => {
    const newGhosts: GhostUnion[] = [];

    newGhosts.push({
      ...(createRandomGhost() as GhostBase),
      type: "orientation-fixed",
      targetAlpha: Math.random() * 360,
      targetBeta: (Math.random() - 0.5) * 60,
      tolerance: 30,
      title: "🎯 회전감지 유령",
    });

    newGhosts.push({
      ...(createRandomGhost() as GhostBase),
      type: "gps-fixed",
      gpsLat: 35.2051749,
      gpsLon: 126.8117561,
      maxVisibleDistance: 100,
      speed: 0,
      isFixed: true,
      title: "🌍 특정 위치 유령",
    });

    newGhosts.push({
      ...(createRandomGhost() as GhostBase),
      type: "always-visible",
      title: "👻 일반 유령",
    });

    setGhosts(newGhosts);
    setScore(0);
    setTotalCaught(0);
  }, []);

  const catchGhost = (index: number) => {
    setGhosts((prev) =>
      prev.map((gh, i) => (i === index ? { ...gh, anim: true } : gh))
    );
    setScore((p) => p + 10);
    setTotalCaught((p) => p + 1);

    setTimeout(() => {
      setGhosts((prev) => {
        const filtered = prev.filter((_, i) => i !== index);
        if (filtered.length === 0) setTimeout(() => resetGame(), 1000);
        return filtered;
      });
    }, 500);
  };

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  return { ghosts, setGhosts, score, totalCaught, resetGame, catchGhost, movementPatterns };
}
