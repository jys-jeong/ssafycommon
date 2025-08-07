import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { classNames, toggleButtonBase } from '@/utils/buttonClassNames';
import { toggleButtonColors } from '@/utils/buttonColors';

interface ToggleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isSelected: boolean;
  selectedVariant: keyof typeof toggleButtonColors;
  unselectedVariant: keyof typeof toggleButtonColors;
  className?: string;
}

export default function ToggleButton({
  children,
  isSelected = false,
  selectedVariant,
  unselectedVariant,
  className = '',
  ...props
}: ToggleButtonProps) {
  const { bg, text, ring } = isSelected ? toggleButtonColors[selectedVariant] : toggleButtonColors[unselectedVariant];

  return (
    <button
      className={classNames(toggleButtonBase, bg, text, ring, className)}
      {...props}
    >
      {children}
    </button>
  );
}
