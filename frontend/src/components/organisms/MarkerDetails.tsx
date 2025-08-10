import MarkerPosts from "@/components/organisms/MarkerPosts";
interface MarkerDetailsProps {
  data: {
    title?: string;
    name?: string;
    description?: string;
    posts?: any[];
    image?: string;
    category?: string;
    address?: string;
    [key: string]: any;
  };
}
export default function MarkerDetails({ data }: MarkerDetailsProps) {
  if (data.posts && data.posts.length > 0) {
    return <MarkerPosts data={data} />;
  }
  return (
    <div className="space-y-4 px-6 py-6">
      <div className="text-2xl font-bold text-center mb-6">
        {data.name || data.title || "장소 정보"}
      </div>
      {data.image && (
        <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
          <img
            src={data.image}
            alt={data.name || data.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="space-y-3">
        {data.category && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="font-semibold text-blue-800">카테고리</div>
            <div className="text-blue-600">{data.category}</div>
          </div>
        )}
        {(data.address || data.description) && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-semibold">설명</div>
            <div className="text-gray-600">
              {data.address || data.description}
            </div>
          </div>
        )}
      </div>
      <div className="flex space-x-2 mt-6">
        <button className="flex-1 bg-[#3A8049] text-white py-3 px-4 rounded-lg font-semibold">
          길찾기
        </button>
        <button className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold">
          저장
        </button>
      </div>
    </div>
  );
}
