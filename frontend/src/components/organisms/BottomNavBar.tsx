import { useRef, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import { BottomNavItem } from "@/components/molecules/BottomNavItem";
import { useBottomNavStore } from "@/store/bottomNavStore";
import { BottomNavClass, BottomNavWrapClass } from "@/utils/bottomNavClassNames";

const menu = [
  { icon: "plus-square", label: "새 게시글" },
  { icon: "trophy", label: "랭킹" },
  { icon: "home", label: "홈" },
  { icon: "shopping-cart", label: "상점" },
  { icon: "user", label: "프로필" },
] as const;

export function BottomNavBar() {
  const { activeIndex } = useBottomNavStore();
  const navRef = useRef<HTMLDivElement>(null);
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

  return (
    <div className="fixed bottom-0 left-0 w-full flex flex-col items-center z-50 pointer-events-none">
      {/* 핸들바 (드래그/풀러 바) */}
      <PullerBar />
      {/* 네비 바 본체 */}
      <div className={BottomNavWrapClass()}>
        <nav ref={navRef} className={BottomNavClass()}>
          {/* 활성화 인디케이터 (애니메이션 원 등) */}
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
          {/* 버튼 목록 */}
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
  );
}
function PullerBar() {
  return (
    <div className="w-full flex justify-center absolute bg-white -top-3 left-0 z-20 pointer-events-none p-[4px] border border-solid rounded-t-[10px]">
      <div className="w-12 h-[4px] rounded-full bg-[#3A8049] opacity-85 shadow-sm" />
    </div>
  );
}