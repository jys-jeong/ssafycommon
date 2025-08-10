import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import searchImg from "@/assets/image.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  recentSearches: string[];
}

export function SearchOverlay({ open, onClose, recentSearches }: SearchOverlayProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="search-overlay"
          className="fixed inset-0 z-50 bg-white bg-opacity-95 flex flex-col"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          // 바깥 영역 클릭시 닫기 원하면 onClick={onClose}
        >
          {/* 상단 검색바 */}
          <div className="flex items-center px-4 py-3 border-b">
            <img src={searchImg} alt="bot" className="w-7 h-7 mr-2" />
            <input
              className="flex-1 bg-transparent outline-none font-bold text-[#66816c]"
              placeholder="광산구 수완동"
              
            />
            <button className="text-2xl ml-2 bg-white" onClick={onClose}>✕</button>
          </div>
          {/* 탭 메뉴 */}
          <div className="flex border-b text-[#66816c] font-semibold text-[15px] bg-white">
            <button className="flex-1 py-2">추천해줄만한 곳</button>
            <button className="flex-1 py-2 border-l border-r border-gray-200">우리집</button>
            <button className="flex-1 py-2">컨설턴트님 댁</button>
          </div>
          {/* 최근 검색 */}
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600 font-semibold">최근 검색</span>
              <button className="text-xs text-gray-400 bg-white">전체 삭제</button>
            </div>
            <ul>
              {recentSearches.map((item, idx) => (
                <li key={item + idx} className="flex items-center py-2 border-b last:border-b-0">
                  <FontAwesomeIcon icon="magnifying-glass" size="lg" />
                  <span className="flex-1 text-[#66816c]">{item}</span>
                  <button className="text-gray-400 text-sm bg-white">✕</button>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}