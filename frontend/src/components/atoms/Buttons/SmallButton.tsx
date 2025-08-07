import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { classNames, smallButtonBase } from '@/utils/buttonClassNames';
import { smallButtonColors } from '@/utils/buttonColors';

interface SmallButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant: keyof typeof smallButtonColors;
  className?: string;
}

export default function SmallButton({
  children,
  variant,
  className = '',
  ...props
}: SmallButtonProps) {
  const { bg, hoverBg, activeBg, ring } = smallButtonColors[variant];

  return (
    <button
      className={classNames(smallButtonBase, bg, hoverBg, activeBg, ring, className)}
      {...props}
    >
      {children}
    </button>
  );
}
