import React from "react";

interface CommentProfileProps {
  src: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-9 h-9", 
  lg: "w-12 h-12"
};

export default function CommentProfile({ src, alt = "", size = "md", className = "" }: CommentProfileProps) {
  return (
    <div className={`${sizeClasses[size]} bg-gray-400/70 rounded-full overflow-hidden ring-1 ring-white/20 shrink-0 ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}
