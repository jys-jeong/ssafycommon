import React from "react";
import { motion } from "framer-motion";
import CommentProfile from "@/components/atoms/Buttons/CommentProfile";
import CommentIconButton from "@/components/atoms/Buttons/CommentIconButton";

interface CommentProfileHeaderProps {
  profileImg: string;
  author: string;
  onClose: () => void;
}

export default function CommentProfileHeader({ profileImg, author, onClose }: CommentProfileHeaderProps) {
  return (
    <motion.div
      className="absolute bg-black bg-opacity-80 top-0 left-0 w-full flex items-center px-4 py-2 z-20"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex items-center">
        <CommentProfile src={profileImg} size="sm" className="mr-2 border-2 border-white shadow-sm bg-cyan-500" />
        <span className="font-semibold text-white text-base">{author}</span>
      </div>
      <motion.button
        onClick={onClose}
        className="ml-auto text-white text-xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
        whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.7)" }}
        whileTap={{ scale: 0.95 }}
        aria-label="닫기"
      >
        ✕
      </motion.button>
    </motion.div>
  );
}
