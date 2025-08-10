import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CommentIconButton from "@/components/atoms/Buttons/CommentIconButton";
import StoryLikeCount from "./StoryLikeCount";

interface ActionButtonsProps {
  isLiked: boolean;
  likes: number;
  onToggleLike: () => void;
  onOpenComments: () => void;
}

export default function ActionButtons({ isLiked, likes, onToggleLike, onOpenComments }: ActionButtonsProps) {
  return (
    <motion.div
      className="absolute right-1 top-3/4 -translate-y-1/2 flex flex-col items-center gap-1 z-10"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <CommentIconButton
        onClick={onToggleLike}
        className={isLiked ? "text-red-400" : "text-white"}
        animate={{
          scale: isLiked ? 1.1 : 1,
          rotate: isLiked ? [0, -10, 10, -10, 0] : 0,
        }}
        transition={{ duration: 0.3 }}
        ariaLabel="좋아요"
      >
        {isLiked ? (
          <FontAwesomeIcon icon={["fas", "heart"]} />
        ) : (
          <FontAwesomeIcon icon={["far", "heart"]} />
        )}
      </CommentIconButton>
      
      <StoryLikeCount likes={likes} />

      <CommentIconButton
        onClick={onOpenComments}
        className="text-white"
        ariaLabel="댓글 열기"
      >
        <FontAwesomeIcon icon={["far", "comment"]} />
      </CommentIconButton>
    </motion.div>
  );
}
