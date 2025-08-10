import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface CaptionSectionProps {
  caption: string;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  contentHeight: number;
  setContentHeight: (height: number) => void;
}

export default function CaptionSection({ 
  caption, 
  isExpanded, 
  onToggleExpanded, 
  contentHeight, 
  setContentHeight 
}: CaptionSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  const maxLength = 50;
  const shouldShowToggle = caption.length > maxLength;
  const displayText = shouldShowToggle && !isExpanded 
    ? caption.slice(0, maxLength) + "..." 
    : caption;

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [displayText, isExpanded, setContentHeight]);

  return (
    <motion.div
      className={`absolute left-0 bottom-0 w-full px-6 pb-3 pt-2 z-20 bg-black bg-opacity-80 bg-gradient-to-t from-black/70 via-transparent to-transparent ${
        shouldShowToggle ? "cursor-pointer" : "cursor-default"
      }`}
      onClick={shouldShowToggle ? onToggleExpanded : undefined}
      whileHover={shouldShowToggle ? { backgroundColor: "rgba(0,0,0,0.9)", scale: 1.01 } : {}}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <motion.div
        className="text-white text-base font-normal w-full overflow-hidden"
        animate={{ height: isExpanded ? contentHeight : 24 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div ref={contentRef} className="leading-6">
          {displayText}
        </div>
      </motion.div>
    </motion.div>
  );
}
