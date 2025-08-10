import React from "react";
interface PostProfileProps {
  src: string;
  alt?: string;
  className?: string;
}
export default function PostProfile({ src, alt = "", className = "" }: PostProfileProps) {
  return (
    <div className={`w-7 h-7 bg-cyan-500 rounded-full overflow-hidden border-2 border-white shadow-sm ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}