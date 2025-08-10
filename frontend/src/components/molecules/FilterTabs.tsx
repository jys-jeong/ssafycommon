import { FilterButton } from "@/components/atoms/Buttons/FilterButton";

export function FilterTabs({ activeTabs = [], onTabToggle }) {
  const tabs = ["전체", "팔로우", "추천"];
  return (
    <div className="flex gap-2 mt-1">
      {tabs.map((tab) => {
        const isActive = activeTabs.includes(tab);
        return (
          <FilterButton
            key={tab}
            color={isActive ? "active" : "inactive"}
            onClick={() => onTabToggle(tab)}
            className={isActive
              ? "bg-[#3A8049] text-white shadow-md border-none font-extrabold rounded-lg"
              : "bg-gray-50 text-[#66816c] border border-[#DBE8D0] shadow-sm hover:bg-[#eaf4e1] rounded-lg"
            }
          >
            {tab}
          </FilterButton>
        );
      })}
    </div>
  );
}