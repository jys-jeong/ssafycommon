import { BottomNavBar } from "@/components/organisms/BottomNavBar";
import Map3D from "@/features/map/Map3D";
import searchImg from "@/assets/image.png";
import { MapHeader } from "../organisms/MapHeader";
import { useState } from "react";
export default function Home() {
  const [activeTab, setActiveTab] = useState("추천");
  return (
    <div className="w-full h-screen min-h-screen overflow-hidden relative bg-white">
      <div className="absolute inset-0 z-0">
        <Map3D />
      </div>
      <MapHeader activeTab={activeTab} onTabClick={setActiveTab} />
      <BottomNavBar />
    </div>
  );
}
