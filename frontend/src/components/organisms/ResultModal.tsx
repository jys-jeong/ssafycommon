import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  score?: number;
  resultImage?: string; // 추가: 결과 이미지
}

export default function ResultModal({ 
  isOpen, 
  onClose, 
  score = 675,
  resultImage = "/path/to/your/result-image.jpg" // 기본 이미지 경로
}: ResultModalProps) {
  const modalView = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            className="fixed inset-0 z-[10000] bg-black bg-opacity-50 backdrop-blur-sm"
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
            {/* 메인 모달 창 */}
            <div
              className="
                w-full max-w-xs mx-auto
                bg-gradient-to-b from-yellow-100 to-green-100
                rounded-3xl overflow-hidden
                shadow-2xl border border-white/20
                relative
              "
              style={{ maxHeight: "85vh" }}
            >
              {/* 상단 제목 */}
              <div className="px-6 pt-6 pb-4">
                <h2 className="text-center text-xl font-bold text-gray-800">
                  Arrive Result
                </h2>
                
                {/* 별점 표시 */}
                <div className="flex justify-center gap-1 mt-4">
                  {[1, 2, 3].map((star, idx) => (
                    <div key={idx} className={`text-2xl ${idx < 2 ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ⭐
                    </div>
                  ))}
                </div>
              </div>

              {/* 진행률 바 */}
              <div className="px-6 pb-4">
                <div className="text-center text-sm text-gray-600 mb-2">
                  Lv.13 → 86%
                </div>
                <div className="w-full bg-white rounded-full h-3 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-1000"
                    style={{ width: "86%" }}
                  />
                </div>
                <div className="text-center text-xs text-gray-500 mt-1">
                  1000 / 1500
                </div>
              </div>

              {/* 가운데 결과 이미지 추가 */}
              <div className="px-6 pb-4 flex justify-center">
                <motion.div
                  className="relative"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-yellow-200 to-green-200">
                    <img
                      src={resultImage}
                      alt="결과 이미지"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // 이미지 로딩 실패 시 기본 아이콘으로 대체
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center text-4xl">
                              🏃‍♂️
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                  {/* 이미지 주변 효과 */}
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-yellow-300 to-green-300 opacity-20 animate-pulse"></div>
                </motion.div>
              </div>

              {/* 점수 섹션들 */}
              <div className="px-6 space-y-3">
                {/* 점수 1 */}
                <motion.div 
                  className="flex items-center justify-between bg-white bg-opacity-50 rounded-xl px-4 py-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-sm">
                      🏃
                    </div>
                    <span className="font-medium text-gray-700">달리기</span>
                  </div>
                  <span className="text-green-600 font-bold">100xp</span>
                </motion.div>

                {/* 점수 2 */}
                <motion.div 
                  className="flex items-center justify-between bg-white bg-opacity-50 rounded-xl px-4 py-3"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-sm">
                      🥇
                    </div>
                    <span className="font-medium text-gray-700">완주</span>
                  </div>
                  <span className="text-green-600 font-bold">250xp</span>
                </motion.div>

                {/* 점수 3 */}
                <motion.div 
                  className="flex items-center justify-between bg-white bg-opacity-50 rounded-xl px-4 py-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold text-sm">
                      ⚡
                    </div>
                    <span className="font-medium text-gray-700">부스트 폐기물</span>
                  </div>
                  <span className="text-green-600 font-bold">200xp</span>
                </motion.div>
              </div>

              {/* 하단 통계 */}
              <div className="px-6 py-4 mt-4">
                <div className="flex justify-between items-center bg-white bg-opacity-40 rounded-xl px-4 py-3">
                  <div className="text-center">
                    <div className="text-gray-600 text-xs">걸음수</div>
                    <div className="font-bold text-gray-800">{score}</div>
                  </div>
                  <div className="w-px h-8 bg-gray-300"></div>
                  <div className="text-center">
                    <div className="text-gray-600 text-xs">시간</div>
                    <div className="font-bold text-gray-800">3.75km</div>
                  </div>
                </div>
              </div>

              {/* 합계 */}
              <div className="px-6 pb-6">
                <div className="bg-green-100 border border-green-200 rounded-xl px-4 py-4">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-bold">Total</span>
                    <div className="text-right">
                      <div className="text-green-600 text-sm">경험치</div>
                      <div className="text-green-700 font-bold text-lg">700xp</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-green-700 font-bold">포인트</span>
                    <div className="text-green-700 font-bold text-lg">450xp</div>
                  </div>
                </div>
              </div>

              {/* 확인 버튼 */}
              <div className="px-6 pb-6">
                <button
                  onClick={onClose}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors duration-200"
                >
                  확인
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return typeof window === "undefined" ? null : createPortal(modalView, document.body);
}