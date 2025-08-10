import { useRef, useState, useEffect } from "react";
import PostProfile from "@/components/atoms/Buttons/PostProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PostIconButton from "@/components/atoms/Buttons/PostIconButton";
import PostPopMenu from "@/components/molecules/PostPopMenu";
import PostFollowButton from "@/components/atoms/Buttons/PostFollowButton";

interface PostHeaderProps {
  author: string;
  timestamp: string;
  profileImg: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PostHeader({ author, timestamp, profileImg, onEdit, onDelete }: PostHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuOpen && ref.current && !ref.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <div className="flex items-center relative pl-[12px] pr-[12px]">
      {/* 왼쪽 : 프로필 / 작성자명 */}
      <PostProfile src={profileImg} />
      <span className="font-semibold text-sm text-gray-900 ml-2">{author}</span>

      {/* 오른쪽 : 팔로우, 타임스탬프, ⋮ 메뉴 */}
      <div className="ml-auto flex items-center gap-x-[5px]">
        <PostFollowButton
          onClick={() => setIsFollowing(!isFollowing)}
          isFollowing={isFollowing}
        />
        <span className="text-[10px] text-gray-500">{timestamp}</span>
        <div ref={ref} className="relative">
          <PostIconButton onClick={() => setMenuOpen(v => !v)} className="text-gray-600 hover:text-gray-800 text-[18px]">
            <FontAwesomeIcon icon="ellipsis-vertical" size="lg" />
          </PostIconButton>
          <PostPopMenu open={menuOpen} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
}
