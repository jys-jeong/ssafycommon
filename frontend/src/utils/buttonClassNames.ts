import clsx from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function classNames(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

export const gradationButtonBase =
  "bg-gradient-to-b rounded-full shadow-[0px_6px_4px_0px_rgba(0,0,0,0.5)] text-white transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-opacity-50 flex items-center justify-center h-8 px-8 mb-3 w-[260px] whitespace-nowrap";

export const smallButtonBase =
  "text-white rounded-[30px] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-[10px] px-2 py-1 leading-[10px] whitespace-nowrap";

export const toggleButtonBase =
  "rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-opacity-50 whitespace-nowrap h-[24px] w-[60px] text-[14px]";

export const basicButtonBase =
  "rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-all duration-200 hover:shadow-[0px_6px_6px_0px_rgba(0,0,0,0.3)] active:shadow-[0px_2px_2px_0px_rgba(0,0,0,0.2)] active:transform active:translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:transform-none whitespace-nowrap min-w-12 px-4 py-1";

export const semiTransparentButtonBase =
  "w-[90px] h-[30px] cursor-pointer transition-all duration-200 hover:opacity-80 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 rounded-[20px] bg-black/30 text-white border border-gray-300 focus:ring-2 focus:outline-none focus:ring-white flex items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap mr-1";

export const dropdownListClass =
  "absolute z-10 mt-1 w-full max-h-[120px] overflow-y-auto bg-white/80 border border-gray-300 rounded-md shadow backdrop-blur-sm";

export const dropdownItemClass =
  "px-2 py-1 text-sm text-black border-b border-gray-300 last:border-b-0 cursor-pointer hover:bg-gray-100";
