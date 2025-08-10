export default function DefaultMenu({ children }: { children?: React.ReactNode }) {
  return (
    <div className="space-y-4 px-6 py-6">
      <div className="text-center text-gray-500 text-sm mb-6">
        마커를 클릭하세요
      </div>
      <div className="text-center py-16 text-gray-400">
        <div className="text-6xl mb-4">🗺️</div>
        <div className="text-lg font-semibold mb-2">지도를 탐색해보세요</div>
        <p className="text-sm px-8">
          마커를 클릭하면 해당 장소의 게시물들을 확인할 수 있습니다
        </p>
      </div>
    </div>
  );
}
