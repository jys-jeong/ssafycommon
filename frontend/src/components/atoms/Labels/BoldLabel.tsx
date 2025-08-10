import type { ReactNode } from 'react';

interface BoldLabelProps {
  children: ReactNode;
  className?: string;
}

export default function BoldLabel({ children, className = '' }: BoldLabelProps) {
  return (
    <p className={`text-base font-bold text-black ${className}`}>
      {children}
    </p>
  );
}
