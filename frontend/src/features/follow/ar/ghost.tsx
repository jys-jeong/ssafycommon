import React from "react";

export interface GhostData {
  src: string;
  pos: { x: number; y: number };
  size: number;
  rotation?: number;   // ⬅️ optional로
  anim?: boolean;      // (권장) optional
  hue?: number;        // (권장) optional
}

interface GhostProps {
  gh: GhostData;
  idx: number;
  onClick: (idx: number, e: React.MouseEvent<HTMLImageElement>) => void;
}

export default function Ghost({ gh, idx, onClick }: GhostProps) {
  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    onClick(idx, e);
  };

  const rotation = gh.rotation ?? 0;
  const hue = gh.hue ?? 0;

  return (
    <img
      src={gh.src}
      alt={`ghost-${idx}`}
      style={{
        position: "absolute",
        left: `${gh.pos.x}%`,
        top: `${gh.pos.y}%`,
        width: `${gh.size}px`,
        height: `${gh.size}px`,
        transform: `translate(-50%,-50%) rotate(${rotation}deg)`,
        filter: gh.anim
          ? `drop-shadow(0 12px 24px rgba(255,0,0,0.8)) brightness(1.5) hue-rotate(${hue}deg) saturate(150%)`
          : `drop-shadow(0 6px 12px rgba(0,0,0,0.4))`,
        cursor: "crosshair",
        transition: "all 0.4s ease-in-out",
        animation: gh.anim ? "ghostCatch 0.5s ease" : "none",
        pointerEvents: "auto",
        zIndex: 10 + idx,
      }}
      onClick={handleClick}
      draggable={false}
    />
  );
}