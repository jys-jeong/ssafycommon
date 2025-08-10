import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { classNames, basicButtonBase } from '@/utils/buttonClassNames';
import { basicButtonColors } from '@/utils/buttonColors'

interface BasicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: keyof typeof basicButtonColors;
  className?: string;
}

export default function BasicButton({
  children,
  variant = 'green',
  className = '',
  ...props
}: BasicButtonProps) {
  const { bg, text } = basicButtonColors[variant];

  return (
    <button
      className={classNames(basicButtonBase, bg, text, className)}
      {...props}
    >
      {children}
    </button>
  );
}
