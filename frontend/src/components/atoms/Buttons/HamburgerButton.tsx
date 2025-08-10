import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { classNames, hamburgerButtonBase } from '@/utils/buttonClassNames';

interface HamburgerButtonProps {
  onClick?: () => void;
  className?: string;
}

export default function HamburgerButton({ onClick, className = '' }: HamburgerButtonProps) {
  return (
    <div className={classNames(hamburgerButtonBase, className)} onClick={onClick}>
      <FontAwesomeIcon icon={faBars} size="lg" />
    </div>
  );
}
