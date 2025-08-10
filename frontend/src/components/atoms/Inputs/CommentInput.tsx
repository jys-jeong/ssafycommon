import React from "react";
import CommentProfile from "../Buttons/CommentProfile";

interface CommentInputProps {
  profileImg: string;
  onSubmit?: (comment: string) => void;
}

export default function CommentInput({ profileImg, onSubmit }: CommentInputProps) {
  return (
    <div
      className="p-3 flex items-center gap-2 border-t border-white/10 bg-black/60 sticky bottom-0"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <input
        type="text"
        placeholder="댓글을 입력하세요…"
        className="flex-1 bg-white/10 text-white placeholder-white/50 rounded-full px-4 py-2 outline-none focus:bg-white/15"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const value = (e.target as HTMLInputElement).value;
            if (onSubmit) onSubmit(value);
            (e.target as HTMLInputElement).value = "";
          }
        }}
      />
      <button className="text-white/90 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20">
        등록
      </button>
    </div>
  );
}
