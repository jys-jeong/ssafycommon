import { useState } from "react";
import { BottomNavBar } from "@/components/organisms/BottomNavBar";
import Map3D from "@/features/map/Map3D";
import { MapHeader } from "../organisms/MapHeader";
import { SearchOverlay } from "@/components/organisms/SearchOverlay"; // 준비된 overlay
import searchImg from "@/assets/image.png";

export default function Home() {
  const [activeTab, setActiveTab] = useState("추천");
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="w-full h-screen min-h-screen overflow-hidden relative bg-white touch-none">
      <div className="absolute inset-0 z-0">
        <Map3D />
      </div>
      {/* MapHeader: SearchTab 클릭 시 setSearchOpen(true) 실행 */}
      <MapHeader
        activeTab={activeTab}
        onTabClick={setActiveTab}
        onSearchClick={() => setSearchOpen(true)}
      />
      <BottomNavBar />
      {/* SearchOverlay는 Home이 직접 띄움 */}
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        recentSearches={["광산구 수완동", "서구 농성동"]}
      />
    </div>
  );
}
