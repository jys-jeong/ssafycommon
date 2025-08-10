import React from "react";
import { motion } from "framer-motion";

interface CommentIconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  whileHover?: any;
  whileTap?: any;
  animate?: any;
  transition?: any;
  ariaLabel?: string;
}

export default function CommentIconButton({ 
  children, 
  onClick, 
  className = "", 
  whileHover = { scale: 1.2 },
  whileTap = { scale: 0.9 },
  animate,
  transition,
  ariaLabel
}: CommentIconButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`bg-transparent text-2xl flex flex-col items-center ${className}`}
      whileHover={whileHover}
      whileTap={whileTap}
      animate={animate}
      transition={transition}
      aria-label={ariaLabel}
    >
      {children}
    </motion.button>
  );
}
