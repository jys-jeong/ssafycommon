// components/organisms/PostResultModal.tsx
import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface PostResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultImage: string;
}

export default function PostResultModal({ 
  isOpen, 
  onClose, 
  resultImage 
}: PostResultModalProps) {
  const modalView = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            className="fixed inset-0 z-[10000] bg-black bg-opacity-80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* 모달 컨테이너 */}
          <motion.div
            className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 이미지 표시 */}
            <div className="relative max-w-[90vw] max-h-[90vh]">
              {/* 닫기 버튼 */}
              <button
                onClick={onClose}
                className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-black bg-opacity-70 text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all duration-200"
              >
                ✕
              </button>
              
              {/* 메인 이미지 */}
              <img
                src={resultImage}
                alt="결과 이미지"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onError={(e) => {
                  // 이미지 로딩 실패 시 처리
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500';
                    errorDiv.innerHTML = '<div class="text-center"><div class="text-4xl mb-2">📷</div><div>이미지를 불러올 수 없습니다</div></div>';
                    target.parentElement.appendChild(errorDiv);
                  }
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return typeof window === "undefined" ? null : createPortal(modalView, document.body);
}
