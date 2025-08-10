import type { ButtonHTMLAttributes, ReactNode } from "react";
import { classNames, transparentButtonBase } from "@/utils/buttonClassNames";
import { transparentButtonColors } from "@/utils/buttonColors";

interface TransparentButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: keyof typeof transparentButtonColors;
  className?: string;
}

export default function TransparentButton({
  children,
  variant = "lightgreen",
  className = "",
  ...props
}: TransparentButtonProps) {
  const { bg, border, activeBg } = transparentButtonColors[variant];

  return (
    <button
      className={classNames(
        transparentButtonBase,
        bg,
        border,
        activeBg,
        focus,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
