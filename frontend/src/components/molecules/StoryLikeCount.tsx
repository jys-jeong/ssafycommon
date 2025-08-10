export default function StoryLikeCount({ likes }: { likes: number }) {
  return <span className="text-[13px] text-white" style={{
    marginLeft:"0.125em"
  }}>{likes}</span>;
}