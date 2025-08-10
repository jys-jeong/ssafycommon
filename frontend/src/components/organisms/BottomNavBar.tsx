import { useRef, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom"; // ✅ 추가
import { BottomNavItem } from "@/components/molecules/BottomNavItem";
import { useBottomNavStore } from "@/store/bottomNavStore";
import { BottomNavClass, BottomNavWrapClass } from "@/utils/bottomNavClassNames";
import type { BottomSheetRef } from "@/components/organisms/BottomSheet";
import { BottomSheet } from "@/components/organisms/BottomSheet";
import Map3D from "@/features/map/Map3D";

const menu = [
  { icon: "plus-square", label: "새 게시글" },
  { icon: "trophy", label: "랭킹" },
  { icon: "home", label: "홈" },
  { icon: "shopping-cart", label: "상점" },
  { icon: "user", label: "프로필" },
] as const;

export function BottomNavBar() {
  const { activeIndex } = useBottomNavStore();
  const location = useLocation(); // ✅ 현재 경로 가져오기
  const navRef = useRef<HTMLDivElement>(null);
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const [positions, setPositions] = useState<{ left: number; width: number }[]>([]);

  useLayoutEffect(() => {
    function calcPos() {
      if (navRef.current) {
        const btns = Array.from(navRef.current.querySelectorAll(".nav-btn")) as HTMLElement[];
        setPositions(btns.map((btn) => ({
          left: btn.offsetLeft,
          width: btn.offsetWidth,
        })));
      }
    }
    calcPos();
    window.addEventListener("resize", calcPos);
    return () => window.removeEventListener("resize", calcPos);
  }, []);

  const activePos = positions[activeIndex];
  
  // ✅ 홈 경로인지 확인
  const isHomePage = location.pathname === '/';

  return (
    <>
      {/* Map3D는 홈 경로일 때만 렌더링 */}
      {isHomePage && <Map3D bottomSheetRef={bottomSheetRef} />}
      
      {/* BottomSheet */}
      <BottomSheet ref={bottomSheetRef}>
        {/* 기본 메뉴 (마커 클릭 시에는 마커 데이터가 우선 표시됨) */}
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="font-semibold">검색</div>
            <div className="text-sm text-gray-600">주변 장소 검색하기</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="font-semibold">필터</div>
            <div className="text-sm text-gray-600">카테고리별 필터링</div>
          </div>
        </div>
      </BottomSheet>

      {/* 바텀 네비게이션 바 */}
      <div className="fixed bottom-0 left-0 w-full flex flex-col items-center z-[100] pointer-events-none">
        <div className={BottomNavWrapClass()}>
          <nav ref={navRef} className={BottomNavClass()}>
            {activePos && (
              <motion.div
                className="absolute"
                style={{
                  left: activePos.left + activePos.width / 2 - 24,
                  top: 0,
                  width: 40,
                  height: 40,
                  zIndex: 0,
                }}
                animate={{
                  left: activePos.left + activePos.width / 2 - 24,
                }}
                transition={{
                  type: "spring",
                  stiffness: 360,
                  damping: 22,
                }}
              >
                <div className="w-12 h-12 bg-[#3A8049] rounded-full shadow-md" />
              </motion.div>
            )}
            
            {menu.map((item, idx) => (
              <BottomNavItem
                key={item.icon}
                index={idx}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
