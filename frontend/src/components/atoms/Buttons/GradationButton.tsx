import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { classNames, gradationButtonBase } from '@/utils/buttonClassNames';
import { gradationButtonColors } from '@/utils/buttonColors'

interface GradationButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant: keyof typeof gradationButtonColors;
  className?: string;
}

export default function GradationButton({
  children,
  variant,
  className = '',
  ...props
}: GradationButtonProps) {
  const { bg } = gradationButtonColors[variant];

  return (
    <button
      className={classNames(gradationButtonBase, bg, className)}
      {...props}
    >
      {children}
    </button>
  );
}
