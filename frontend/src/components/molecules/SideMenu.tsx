import { useEffect } from "react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface MenuItem {
  label: string;
  onClick: () => void;
}

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

export default function SideMenu({ isOpen, onClose, menuItems }: SideMenuProps) {
  // ESC 누르면 닫기
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      {/* 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
        />
      )}

      {/* 사이드 메뉴 */}
      <div
        className={`fixed top-0 right-0 h-full w-40 bg-white z-50 shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 좌상단 닫기 화살표 버튼 */}
				<button
					onClick={onClose}
					aria-label="닫기"
					className="absolute top-1 left-0 text-black bg-white"
				>
					<FontAwesomeIcon icon={faArrowLeft} size="lg" />
				</button>

        {/* 메뉴 항목 */}
        <div className="flex flex-col justify-center h-full gap-2 font-bold text-black text-lg">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.onClick}
              className="text-right py-2 bg-white rounded"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
