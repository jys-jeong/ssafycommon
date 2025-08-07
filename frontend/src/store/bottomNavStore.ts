// 하단 메뉴의 활성화 인덱스를 zustand의 store로 전역 관리
import { create } from "zustand";

interface BottomNavState {
  activeIndex: number;
  setActiveIndex: (idx: number) => void;
}

export const useBottomNavStore = create<BottomNavState>((set) => ({
  activeIndex: 2,
  setActiveIndex: (idx) => set({ activeIndex: idx }),
}));
