import ImageCard from "@/components/molecules/ImageCard";

interface ImageGridProps {
  imageUrls: string[];
  onImageClick?: (index: number) => void;
}

export default function ImageGrid({ imageUrls, onImageClick }: ImageGridProps) {
  return (
    <div className="grid grid-cols-3">
      {imageUrls.map((url, idx) => (
        <ImageCard
          key={idx}
          imageUrl={url}
          onClick={() => onImageClick?.(idx)}
        />
      ))}
    </div>
  );
}
