export const gradationButtonColors = {
  green: {
    bg: "from-[#e7e54f] via-[#82ae1f] via-[50%] to-[#609b1e]",
  },
  black: {
    bg: "from-[#333333] via-[#1a1a1a] via-[50%] to-[#000000]",
  },
};

export const smallButtonColors = {
  green: {
    bg: "bg-[#39DF78]",
  },
  red: {
    bg: "bg-[#E36D6D]",
  },
};

export const toggleButtonColors = {
  darkgreen: {
    bg: "bg-[#3a8049]",
    text: "text-[#ffffff]",
  },
  lightgreen: {
    bg: "bg-[#98DEA7]",
    text: "text-[#000000]",
  },
  white: {
    bg: "bg-[#ffffff]",
    text: "text-[#000000]",
  },
  gray: {
    bg: "bg-[#B4B4B4]",
    text: "text-[#000000]",
  },
};

export const basicButtonColors = {
  blue: {
    bg: "bg-[#2280fb]",
    text: "text-white",
  },
  red: {
    bg: "bg-[#ff0000]",
    text: "text-white",
  },
  gray: {
    bg: "bg-[#d6d6d6]",
    text: "text-black",
  },
  green: {
    bg: "bg-[#3a8049]",
    text: "text-white",
  },
  white: {
    bg: "bg-white",
    text: "text-[#1f1f1f]",
  },
};

export type basicButtonVariant = keyof typeof basicButtonColors;

export const profileButtonColors = {
  lightgreen: {
    bg: "bg-green-100/50",
    activeBg: "hover:bg-[#C6E8C8]",
    border: "border border-white border-[1px]",
  },
  darkgreen: {
    bg: "bg-[#3A8049]",
    activeBg: "hover:bg-[#2e6a3b]",
    border: "border border-white border-[1px]",
  },
};

export const transparentButtonColors = {
  lightgreen: {
    bg: "bg-green-100/50",
    activeBg: "hover:bg-[#C6E8C8]",
    border: "border border-white",
  },
};

export const blockButtonColors = {
  selected: "bg-[#3A8049] text-white",
  unselected: "bg-black/5 text-[#3A8049]",
};
