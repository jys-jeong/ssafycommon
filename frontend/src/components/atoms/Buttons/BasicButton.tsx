import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { classNames, basicButtonBase } from '@/utils/buttonClassNames';
import { basicButtonColors } from '@/utils/buttonColors'

interface BasicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant: keyof typeof basicButtonColors;
  className?: string;
}

export default function BasicButton({
  children,
  variant,
  className = '',
  ...props
}: BasicButtonProps) {
  const { bg, hoverBg, text, ring } = basicButtonColors[variant];

  return (
    <button
      className={classNames(basicButtonBase, bg, hoverBg, text, ring, className)}
      {...props}
    >
      {children}
    </button>
  );
}

