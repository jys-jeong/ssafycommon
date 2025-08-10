import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CommentHandleBar from "@/components/atoms/Buttons/CommentHandleBar";
import CommentInput from "@/components/atoms/Inputs/CommentInput";
import CommentList from "../molecules/CommentList";

interface CommentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  profileImg: string;
}

export default function CommentSheet({ isOpen, onClose, profileImg }: CommentSheetProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[10001]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) onClose();
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="
                mx-auto max-w-md sm:max-w-lg md:max-w-2xl
                rounded-t-[24px] overflow-hidden
                bg-gradient-to-b from-black/70 to-black/80
                border-t border-white/10 shadow-2xl
                flex flex-col
              "
              style={{ maxHeight: "70vh" }}
            >
              {/* 핸들바 + 헤더 */}
              <div className="shrink-0">
                <CommentHandleBar />
                <div className="px-4 pb-2 flex items-center justify-between">
                  <h3 className="text-white font-semibold">댓글</h3>
                </div>
              </div>

              <CommentList />
              <CommentInput profileImg={profileImg} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
