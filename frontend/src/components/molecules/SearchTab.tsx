import React from "react";

export function SearchTab({ imgSrc, title }) {
  return (
    <div className="flex items-center gap-2">
      <img src={imgSrc} alt="bot mascot" className="w-7 h-7" />
      <span className="font-bold text-[#66816c] text-base tracking-tight">{title}</span>
    </div>
  );
}