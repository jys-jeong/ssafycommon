import { useState } from "react";
import PostHeader from "@/components/molecules/PostHeader";
import PostImageGallery from "@/components/molecules/PostImageGallery";
import PostLikeCount from "@/components/molecules/PostLikeCount";
import PostCommentInput from "@/components/molecules/PostCommentInput";
import CommentSheet from "@/components/organisms/CommentSheet";
import PostResultModal from "@/components/organisms/PostResultModal"; // 변경
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import profileImg from "@/assets/profile.png";
import img from "@/assets/image.jpg";

interface PostItemProps {
  post: {
    id: string;
    author: string;
    content: string;
    image?: string | string[];
    images?: string[];
    likes: number;
    comments: number;
    timestamp: string;
  };
}

export default function PostItem({ post }: PostItemProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isScrap, setIsScrap] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  // 안전한 이미지 배열 처리 (에러 방지)
  let images: string[] = [];
  try {
    if (post?.images && Array.isArray(post.images)) {
      images = post.images.filter(
        (img) => typeof img === "string" && img.length > 0
      );
    } else if (post?.image) {
      if (Array.isArray(post.image)) {
        images = post.image.filter(
          (img) => typeof img === "string" && img.length > 0
        );
      } else if (typeof post.image === "string" && post.image.length > 0) {
        images = [post.image];
      }
    }
  } catch (error) {
    console.warn("이미지 처리 중 오류:", error);
    images = [];
  }

  const toggleLike = () => setIsLiked(!isLiked);
  const toggleScrap = () => setIsScrap(!isScrap);
  const toggleContent = () => setShowFullContent(!showFullContent);
  const openCommentSheet = () => setIsCommentSheetOpen(true);
  const closeCommentSheet = () => setIsCommentSheetOpen(false);
  const openResultModal = () => setIsResultModalOpen(true);
  const closeResultModal = () => setIsResultModalOpen(false);

  const truncateContent = (text: string, maxLength: number = 100) =>
    text && text.length <= maxLength
      ? text
      : (text || "").slice(0, maxLength) + "...";

  // post 객체가 없거나 필수 데이터가 없는 경우 처리
  if (!post || !post.id) {
    return (
      <div className="bg-white border-b border-gray-100 pb-2 pt-[5px] px-4 py-4">
        <div className="text-gray-500 text-center">
          게시물을 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border-b border-gray-100 pb-2 pt-[5px]">
        <PostHeader
          author={post.author || "알 수 없음"}
          timestamp={post.timestamp || ""}
          profileImg={profileImg}
          onEdit={() => {}}
          onDelete={() => {}}
        />

        {images.length > 0 && (
          <PostImageGallery
            images={images}
            currentIndex={currentImageIndex}
            onIndexChange={setCurrentImageIndex}
          />
        )}

        <div className="flex items-center justify-between px-3 pt-1">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLike}
              className={`bg-white transition-all duration-200 p-0 outline-none border-none focus:outline-none focus:ring-0 ${
                isLiked
                  ? "text-red-500 scale-110"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              style={{
                outline: "none",
                border: "none",
                boxShadow: "none",
              }}
            >
              {isLiked ? (
                <FontAwesomeIcon icon={["fas", "heart"]} size="lg" />
              ) : (
                <FontAwesomeIcon icon={["far", "heart"]} size="lg" />
              )}
            </button>

            <PostLikeCount likes={(post.likes || 0) + (isLiked ? 1 : 0)} />

            <button
              onClick={openCommentSheet}
              className="bg-white transition-all duration-200 p-0 ml-0 outline-none border-none focus:outline-none hover:text-gray-900"
              style={{
                marginLeft: "5px",
                outline: "none",
                border: "none",
                boxShadow: "none",
              }}
            >
              <FontAwesomeIcon icon={["far", "comment"]} size="lg" />
            </button>

            <button
              onClick={toggleScrap}
              className="text-gray-700 hover:text-gray-900 p-0 outline-none border-none"
              style={{ outline: "none", border: "none", marginLeft: "0.125em" }}
            >
              {isScrap ? (
                <FontAwesomeIcon icon={["fas", "bookmark"]} size="lg" />
              ) : (
                <FontAwesomeIcon icon={["far", "bookmark"]} size="lg" />
              )}
            </button>
          </div>

          {/* person-running 버튼 */}
          <button
            onClick={openResultModal}
            className="rounded-full h-[22px] bg-[#3A8049] hover:bg-[#2d6b3a] transition-colors duration-200"
          >
            <FontAwesomeIcon
              icon="person-running"
              className="align-top text-white"
            />
          </button>
        </div>

        <div className="px-4 pt-2 text-left">
          <div className="text-sm text-gray-900">
            <span>
              {showFullContent
                ? post.content || ""
                : truncateContent(post.content || "")}
            </span>
            {(post.content || "").length > 10 && (
              <button
                onClick={toggleContent}
                className="text-gray-500 hover:text-gray-700 ml-1"
              >
                {showFullContent ? "접기" : "더 보기"}
              </button>
            )}
          </div>
        </div>

        <div className="px-3 pt-3">
          <PostCommentInput />
        </div>
      </div>

      {/* CommentSheet */}
      <CommentSheet
        isOpen={isCommentSheetOpen}
        onClose={closeCommentSheet}
        profileImg={profileImg}
      />

      {/* PostResultModal - 이미지만 표시 */}
      <PostResultModal
        isOpen={isResultModalOpen}
        onClose={closeResultModal}
        resultImage={img}
      />
    </>
  );
}
