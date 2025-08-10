import PostItem from "@/components/organisms/PostItem";
interface MarkerPostsProps {
  data: {
    title: string;
    description: string;
    posts: any[];
  };
}
export default function MarkerPosts({ data }: MarkerPostsProps) {
  return (
    <div className="bg-white">
      <div className="pb-20">
        {data.posts && data.posts.length > 0 ? (
          data.posts.map((post, index) => (
            <PostItem key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-16 text-gray-500">
            <div className="text-6xl mb-4">📸</div>
            <div className="text-lg font-semibold mb-2">
              아직 게시물이 없습니다
            </div>
            <p className="text-sm px-8">
              이 장소의 첫 번째 게시물을 작성해서 다른 사람들과 공유해보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
