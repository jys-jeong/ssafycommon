import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import ProfileHeader from "../molecules/CommentProfileHeader";
import ActionButtons from "../molecules/CommentActionButtons";
import CaptionSection from "../molecules/CommentCaptionSection";
import CommentSheet from "../organisms/CommentSheet";
import profileImg from "@/assets/profile.png";

export default function PostGalleryModal({
  images,
  selectedImage,
  onClose,
  img,
  author = "kimtaemin",
  likes = 1234,
  caption = "아 자연으로 들어가 포근하고 싶네... 살려... 이 곳은 정말 아름다운 곳이에요. 날씨도 좋고 공기도 맑고 정말 힐링이 되는 것 같습니다. 가족들과 함께 와서 좋은 추억을 만들 수 있었어요. 다음에도 꼭 다시 오고 싶은 곳입니다. 여러분도 한번 방문해보세요!",
}: {
  images: string[];
  selectedImage: number;
  onClose: () => void;
  img?: string;
  author?: string;
  likes?: number;
  caption?: string;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const toggleLike = () => setIsLiked(!isLiked);
  const toggleExpanded = () => setIsExpanded(!isExpanded);
  const openSheet = () => setIsSheetOpen(true);
  const closeSheet = () => setIsSheetOpen(false);

  const modalView = (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-80 z-[9999] flex items-center justify-center"
      style={{ minHeight: "100dvh", minWidth: "100vw" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <div
        className="relative w-full h-full flex flex-col bg-transparent"
        style={{ maxWidth: "100vw", maxHeight: "100dvh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <ProfileHeader 
          profileImg={profileImg} 
          author={author} 
          onClose={onClose} 
        />

        {/* 메인 이미지 */}
        <div
          className="flex-grow flex items-center justify-center relative select-none"
          style={{ minHeight: "65vh", paddingTop: "60px", paddingBottom: "125px" }}
        >
          <motion.img
            src={img ?? images[selectedImage]}
            alt={`이미지 ${selectedImage + 1}`}
            className="max-h-full max-w-[90vw] rounded-xl shadow-lg bg-gray-200"
            style={{ objectFit: "contain", aspectRatio: "auto", background: "#eee" }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          <ActionButtons
            isLiked={isLiked}
            likes={likes + (isLiked ? 1 : 0)}
            onToggleLike={toggleLike}
            onOpenComments={openSheet}
          />
        </div>

        <CaptionSection
          caption={caption}
          isExpanded={isExpanded}
          onToggleExpanded={toggleExpanded}
          contentHeight={contentHeight}
          setContentHeight={setContentHeight}
        />

        <CommentSheet
          isOpen={isSheetOpen}
          onClose={closeSheet}
          profileImg={profileImg}
        />
      </div>
    </motion.div>
  );

  return typeof window === "undefined" ? null : createPortal(modalView, document.body);
}
