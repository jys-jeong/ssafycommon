import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { classNames, profileButtonBase } from '@/utils/buttonClassNames';
import { profileButtonColors } from '@/utils/buttonColors';

interface ProfileButtonProps {
  onClick?: () => void;
  variant?: keyof typeof profileButtonColors;
  className?: string;
}

export default function ProfileButton({
  onClick,
  variant = 'lightgreen',
}: ProfileButtonProps) {
  const { bg, border, activeBg } = profileButtonColors[variant];

  return (
    <div
      className={classNames(profileButtonBase, bg, border, activeBg)}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faUser} size="3x" />
    </div>
  );
}
