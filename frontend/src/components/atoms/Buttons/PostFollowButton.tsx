// components/atoms/FollowButton.tsx
import React from "react";
export default function PostFollowButton({ onClick, isFollowing = false }: {
  onClick?: () => void;
  isFollowing?: boolean;
}) {
  return (
    <button
      className={`w-[50px] h-[25px] rounded text-[10px] transition text-white font-semibold
        ${isFollowing ? "bg-gray-400" : "bg-[#3A8049]"}`}
      onClick={onClick}
    >
      {isFollowing ? "팔로잉" : "팔로우"}
    </button>
  );
}
