export default function PostLikeCount({ likes }: { likes: number }) {
  return <span className="text-[13px]" style={{
    marginLeft:"0.125em"
  }}>{likes}</span>;
}