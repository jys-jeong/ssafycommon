import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { classNames, semiTransparentButtonBase } from '@/utils/buttonClassNames';

interface SemiTransparentButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: string;
}

export default function SemiTransparentButton({
  children,
  className = '',
  ...props
}: SemiTransparentButtonProps) {
  return (
    <button
      className={classNames(semiTransparentButtonBase, className)}
      {...props}
    >
      {children}
    </button>
  );
}