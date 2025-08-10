import { useEffect, useState } from "react";
import TransparentButton from "@/components/atoms/Buttons/TransparentButton";
import HamburgerButton from "../atoms/Buttons/HamburgerButton";
import ProfileButton from "../atoms/Buttons/ProfileButton";
import BlockButton from "../atoms/Buttons/BlockButton";
import ToggleButton from "../atoms/Buttons/ToggleButton";
import Modal from "@/components/molecules/Modal";
import ImageGrid from "@/components/organisms/ImageGrid";
import SideMenu from "@/components/molecules/SideMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableCellsLarge, faPersonWalking, faBookmark } from "@fortawesome/free-solid-svg-icons"
import { BottomNavBar } from "../organisms/BottomNavBar";
import ghosts from '@/assets/bgimages/ghosts.png'

export default function Profile() {
  // 토글 버튼 상태
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  // 메뉴 버튼 상태
  const [menuOpen, setMenuOpen] = useState(false);
  // 백엔드 서버와 연결할 변수들
  const [isFollowing, setIsFollowing] = useState(true);
  const [isMyProfile, setIsMyProfile] = useState(true);
  const [nickname, setNickname] = useState('jhun156');
  const [name, setName] = useState('박지훈');
  const [post, setPost] = useState(11);
  const [follow, setFollow] = useState(12);
  const [following, setFollowing] = useState(13);
  const [level, setLevel] = useState(13);
  const [currentExp, setCurrentExp] = useState(1000);
  const [maxExp, setMaxExp] = useState(1500);

  // 백엔드 서버와 연결하면 자동으로 완성되는 변수들
  const [animatedExp, setAnimatedExp] = useState(0);
  const expPercentage = ((currentExp / maxExp ) *  100).toFixed(0);
  
  // 이미지 화면을 보여주기 위한 더미 이미지 경로
  const dummyImages = Array.from({ length: 18}, () => ghosts)

  // 백엔드 서버와 연결한 후 이미지 경로 연결할 상태들
  const [myPostUrls, setMyPostUrls] = useState<string[]>(dummyImages);
  const [resultPostUrls, setResultPostUrls] = useState<string[]>(dummyImages);
  const [scrapPostUrls, setScrapPostUrls] = useState<string[]>(dummyImages);

  // 햄버거 버튼 진입시 나오는 버튼 목록
  const menuItems = [
    { 
      label: "내 업적",
      onClick: () => {
        setMenuOpen(false);
      }
    },
    { 
      label: "프로필 꾸미기",
      onClick: () => {
        setMenuOpen(false)
      }
    },
    { label: "개인정보 수정",
      onClick: () => {
        setMenuOpen(false)
      }
    },
    { label: "회원 탈퇴",
      onClick: () => {
        setMenuOpen(false)
      }
    },
  ];

  // 토글 버튼 함수
  const onToggleFollow = () => {
    setIsFollowing((prev) => !prev)
  }

  // 프로필 화면 진입 시 레벨 경험치 애니메이션 효과 함수
  useEffect(() => {
    const target = parseInt(expPercentage);
    let current = 0;

    const interval = setInterval(() => {
      current += 1;
      if (current > target) {
        clearInterval(interval);
      } else {
        setAnimatedExp(current);
      }
    }, 10); // 숫자가 클수록 느려짐

    return () => clearInterval(interval);
  }, [expPercentage]);

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-gray-50">

      <HamburgerButton
        className="absolute top-4 right-4"
        onClick={() => setMenuOpen(true)}
      />

      <SideMenu 
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        menuItems={menuItems}
      />

      {/* 프로필 정보 카드 */}
      <div className="w-full max-w-md bg-black/10 rounded-none">
        <div className="flex flex-col items-center mt-10">
          <ProfileButton />
          <p className="text-black text-xl mt-2">
            {nickname}
            <span className="mx-1">☆</span>
          </p> 
          <p className="text-black text-sm mb-2">{name}</p>

          {!isMyProfile && (
            <ToggleButton
              isSelected={isFollowing}
              selectedVariant="gray"
              unselectedVariant="darkgreen"
              onClick={onToggleFollow}
              className="mb-2"
            >
              {isFollowing ? '팔로잉' : '팔로우'}
            </ToggleButton>
          )}

          <div className="flex justify-center items-center mt-2 mb-4">
            <TransparentButton>
              게시물<br />
              <span className="font-bold text-lg">{post}</span>
            </TransparentButton>

            <TransparentButton>
              팔로우<br />
              <span className="font-bold text-lg">{follow}</span>
            </TransparentButton>

            <TransparentButton>
              팔로잉<br />
              <span className="font-bold text-lg">{following}</span>
            </TransparentButton>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-black">Lv. {level}</p>
              <div className="relative w-48 h-3 rounded-full overflow-hidden bg-black/15">
                <div
                  className="absolute top-0 left-0 h-full rounded-full bg-[#8AC78F]"
                  style={{ width: `${animatedExp}%` }}
                ></div>
              </div>
            <p className="text-black">{expPercentage} %</p>
          </div>

          <p className="text-black mb-4">{currentExp} / {maxExp}</p>          

        </div>
      </div>

      {/* 하단 메뉴 버튼 */}
      <div className="flex items-center w-full max-w-md">
        <BlockButton
          icon={<FontAwesomeIcon icon={faTableCellsLarge} size="xl" />}
          selected={selectedIndex === 0}
          onClick={() => setSelectedIndex(0)}
        />

        <BlockButton
          icon={<FontAwesomeIcon icon={faPersonWalking} size="xl" />}
          selected={selectedIndex === 1}
          onClick={() => setSelectedIndex(1)}
        />

        {isMyProfile && (
          <BlockButton
            icon={<FontAwesomeIcon icon={faBookmark} size="xl" />}
            selected={selectedIndex === 2}
            onClick={() => setSelectedIndex(2)}
          />
        )}
      </div>
      
      <div className="flex-1 w-full max-w-md">
        {selectedIndex === 0 && (
          <ImageGrid imageUrls={myPostUrls} />
        )}

        {selectedIndex === 1 && (
          <ImageGrid imageUrls={resultPostUrls} />
        )}

        {selectedIndex === 2 && isMyProfile && (
         <ImageGrid imageUrls={scrapPostUrls} />
        )}
      </div>

      <BottomNavBar />
    </div>
  );
}
