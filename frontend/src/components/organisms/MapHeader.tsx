import { SearchTab } from "@/components/molecules/SearchTab";
import { FilterTabs } from "@/components/molecules/FilterTabs";
import searchImg from "@/assets/image.png";
import { useState } from "react";

export function MapHeader() {
  const [activeTabs, setActiveTabs] = useState(["전체"]);

  const handleTabToggle = (tab) => {
    setActiveTabs((prev) => {
      let next;
      if (prev.includes(tab)) {
        // 이미 선택된 탭을 클릭: 해제
        next = prev.filter((t) => t !== tab);
      } else {
        // 선택 안 된 탭 클릭: 추가
        next = [...prev, tab];
      }

      // 1. 팔로우와 추천이 모두 있고 전체가 있으면 전체를 빼줌
      if (
        next.includes("팔로우") ||
        next.includes("추천") &&
        next.includes("전체")
      ) {
        next = next.filter((t) => t !== "전체");
      }

      // 2. 팔로우도 없고 추천도 없으면 전체를 강제로 살림
      if (!next.includes("팔로우") && !next.includes("추천")) {
        next = ["전체"];
      }

      return next;
    });
  };

  return (
    <div className="absolute top-0 left-0 w-full block justify-items-center justify-center z-20 pointer-events-none">
      <div
        className="flex flex-col gap-2 bg-white rounded-[18px] shadow-lg px-4 py-2 mt-5 border border-gray-200 pointer-events-auto"
        style={{ width: 300 }}
      >
        <SearchTab imgSrc={searchImg} title="광산구 수완동" />
      </div>
      <div
        className="flex flex-col items-center gap-2 rounded-[18px] px-4 py-[2px] mt-[5px] pointer-events-auto"
        style={{ width: 300 }}
      >
        <FilterTabs activeTabs={activeTabs} onTabToggle={handleTabToggle} />
      </div>
    </div>
  );
}
