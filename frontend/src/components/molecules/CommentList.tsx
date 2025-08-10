import React from "react";
import CommentItem from "./CommentItem";

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatarSrc?: string;
}

interface CommentListProps {
  comments?: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
  // 기본 더미 데이터
  const defaultComments = Array.from({ length: 15 }).map((_, i) => ({
    id: `comment-${i}`,
    author: "Kimtaemin",
    content: "하.. 오늘도 나의 스트레스는 끝없이 증가하네 세번째 레슨... 참자..",
    timestamp: "2분 전"
  }));

  const displayComments = comments || defaultComments;

  return (
    <div
      className="flex-1 overflow-y-auto px-4 pb-4"
      style={{
        overscrollBehavior: "contain",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <ul className="space-y-4">
        {displayComments.map((comment) => (
          <CommentItem
            key={comment.id}
            author={comment.author}
            content={comment.content}
            timestamp={comment.timestamp}
            avatarSrc={comment.avatarSrc}
          />
        ))}
      </ul>
    </div>
  );
}
