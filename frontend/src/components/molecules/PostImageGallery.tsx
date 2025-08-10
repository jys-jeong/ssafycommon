import React, { useRef, useState } from "react";
import PostGalleryModal from "@/components/molecules/PostGalleryModal";
import img from "@/assets/image.jpg"; // 실제로는 images[index] 사용 권장 (props.images)

export default function PostImageGallery({
  images,
  currentIndex,
  onIndexChange,
}: {
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (idx: number) => {
    setSelectedImage(idx);
    onIndexChange(idx);
  };

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    if (scrollContainerRef.current) {
      setScrollLeft(scrollContainerRef.current.scrollLeft);
    }
  };
  const handleDragMove = (clientX: number) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const walk = (startX - clientX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft + walk;
  };

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide gap-1 py-2 px-3 cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
        onTouchStart={e => handleDragStart(e.touches[0].clientX)}
        onTouchMove={e => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={() => setIsDragging(false)}
        onMouseDown={e => handleDragStart(e.clientX)}
        onMouseMove={e => handleDragMove(e.clientX)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`flex-shrink-0 w-20 h-[120px] bg-gray-200 rounded-lg overflow-hidden cursor-pointer transition-all duration-200`}
            onClick={() => handleImageClick(index)}
          >
            <img
              src={img}
              alt={`썸네일 ${index + 1}`}
              className="w-full h-full object-cover"
              onError={e => {
                const target = e.currentTarget;
                target.style.display = "none";
                const placeholder = document.createElement("div");
                placeholder.className = "w-full h-full bg-gray-100 flex items-center justify-center text-gray-400";
                placeholder.innerHTML = '<div class="text-xs">📷</div>';
                target.parentElement?.appendChild(placeholder);
              }}
            />
          </div>
        ))}
      </div>
      {selectedImage !== null && (
        <PostGalleryModal
          images={img}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          onClose={() => setSelectedImage(null)}
          img={img}
        />
      )}
    </div>
  );
}
