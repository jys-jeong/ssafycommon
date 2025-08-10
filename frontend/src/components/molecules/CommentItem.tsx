import React from "react";
import CommentProfile from "@/components/atoms/Buttons/CommentProfile";
import profileImg from "@/assets/profile.png";
interface CommentItemProps {
  author: string;
  content: string;
  timestamp: string;
  avatarSrc?: string;
}

export default function CommentItem({ author, content, timestamp, avatarSrc }: CommentItemProps) {
  return (
    <li className="flex gap-3">
      <CommentProfile src={profileImg || "/default-avatar.png"} size="md" className="bg-gray-400/70" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-white/90">
          <span className="font-semibold text-sm">{author}</span>
          <span className="text-xs text-white/60">{timestamp}</span>
        </div>
        <p className="text-white/90 text-sm">{content}</p>
      </div>
    </li>
  );
}
