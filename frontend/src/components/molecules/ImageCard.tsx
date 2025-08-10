import ghosts from '@/assets/bgimages/ghosts.png'

interface ImageCardProps {
  imageUrl: string;
  onClick?: () => void;
  alt?: string;
}

export default function ImageCard({
  imageUrl,
  onClick,
  alt = "게시글 이미지",
}: ImageCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full aspect-square border border-gray-300 p-0 bg-transparent rounded-none font-normal text-base"
    >
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = ghosts;
        }}
      />
    </button>
  );
}
