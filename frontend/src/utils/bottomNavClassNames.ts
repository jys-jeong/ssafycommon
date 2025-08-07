import clsx from "clsx";

// 버튼 wrapper (여백 확보용 px-2, 배경/정렬/전체 높이 조절)
export const bottomNavItemClass = () =>
  "flex flex-col justify-center items-center flex-1 min-w-0 relative transition-all cursor-pointer bg-white px-2 pt-[1px] pb-[0px]";

// icon, label을 모두 감싸는 원
export const bottomNavIconWrapClass = (isActive: boolean) =>
  clsx(
    "flex flex-col items-center justify-center rounded-full transition-all",
    // 크기 w-12/h-12(48px), Tailwind에서 조절 가능, label이 같이 들어가면 좀 더 넉넉하게
    isActive ? "w-5 h-5 bg-[#3A8049] shadow-md" : "w-10 h-10 bg-white"
  );

// icon 색상 (선택시 흰색, 비선택시 연녹색)
export const bottomNavIconColor = (isActive: boolean) =>
  isActive ? "#ffffff" : "#3A8049";

// label className (폰트 더 작게: text-[9px], 강조)
export const bottomNavLabelClass = (isActive: boolean) =>
  clsx(
    "text-[9px] font-bold transition-colors leading-tight",
    // padding-top으로 아이콘과 label 사이 적당한 여백
    isActive ? "text-white" : "text-[#3A8049]"
  );

export const BottomNavBarClass = ()=>
  clsx(
  "w-full flex justify-around items-end bg-white border-t border-gray-200 rounded-b-2xl shadow-[0_-1px_16px_rgba(48,116,66,0.08)] fixed px-[15px] bottom-0 left-0 z-50"
);

export const BottomNavClass= ()=>
  clsx(
  "w-full relative flex justify-around items-end bg-white rounded-bl-2xl rounded-br-2xl rounded-tl-none rounded-tr-none px-[15px] py-1 h-[50px] max-w-[430px] min-w-[320px] z-10 pointer-events-auto"
);

export const BottomNavWrapClass= ()=>
  clsx(
  "w-full p-[1px] bg-gradient-to-r from-[#D8E27B] to-[#FFD330] pointer-events-none rounded-bl-2xl rounded-br-2xl rounded-tl-none rounded-tr-none"
);