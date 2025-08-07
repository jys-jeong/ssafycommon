// FontAwesomeIcon을 감싸 프로젝트 전역에서 동일하게 사용할 수 있는 atom 컴포넌트
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface BottomMenuIconProps {
  name: 'home' | 'trophy' | 'user' | 'shopping-cart' | 'plus-square';
  size?: string;
  color?: string;
  className?: string;
}

// 아이콘 이름을 문자열로 받아 매핑 (코드 가독성↑)
const bottomMenuIconMap = {
  home: 'home',
  trophy: 'trophy',
  user: 'user',
  'shopping-cart': 'shopping-cart',
  'plus-square': 'plus-square',
};

export function BottomMenuIcon({ name, size = "lg", color = "#66816c",className }: BottomMenuIconProps) {
  return <FontAwesomeIcon icon={bottomMenuIconMap[name]} size={size} color={color} className={className} />;
}
