import {
  bottomNavItemClass,
  bottomNavLabelClass,
} from "@/utils/bottomNavClassNames";
import { BottomMenuIcon } from "@/components/atoms/Icons/BottomMenuIcon";
import { useBottomNavStore } from "@/store/bottomNavStore";

interface Props {
  icon: "home" | "trophy" | "user" | "shopping-cart" | "plus-square";
  label: string;
  index: number;
}

export function BottomNavItem({ icon, label, index }: Props) {
  const { activeIndex, setActiveIndex } = useBottomNavStore();
  const isActive = activeIndex === index;

  return (
    <button
      type="button"
      onClick={() => setActiveIndex(index)}
      className={"nav-btn " + bottomNavItemClass()}
      style={{
        position: "relative",
        zIndex: 1,
        width: 54,
        height: 40,
        background: "transparent",
      }}
    >
      {/* 아이콘+라벨은 항상 버튼 위에, 초록 원은 nav에서 따로 이동 */}
      <div className="flex flex-col items-center justify-center w-12 h-12 relative z-10">
        <BottomMenuIcon
          name={icon}
          className="text-[20px] mb-[3px]"
          color={isActive ? "#fff" : "#3A8049"}
        />
        <span
          className={bottomNavLabelClass(isActive)}
          style={{ color: isActive ? "#fff" : "#3A8049" }}
        >
          {label}
        </span>
      </div>
    </button>
  );
}