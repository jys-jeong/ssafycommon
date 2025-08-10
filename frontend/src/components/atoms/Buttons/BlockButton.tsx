import type { ReactNode } from 'react';
import { classNames, blockButtonBase } from '@/utils/buttonClassNames';
import { blockButtonColors } from '@/utils/buttonColors';

interface BlockButtonProps {
  icon: ReactNode;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

export default function BlockButton({ icon, selected, onClick, className = '' }: BlockButtonProps) {
  const bg = selected ? blockButtonColors.selected : blockButtonColors.unselected;

  return (
    <button
      className={classNames(blockButtonBase, bg, className)}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}
