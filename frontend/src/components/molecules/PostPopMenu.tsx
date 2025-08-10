import React from "react";

interface PostPopMenuProps {
  open: boolean;
  onEdit: () => void;
  onDelete: () => void;
}
export default function PostPopMenu({ open, onEdit, onDelete }: PostPopMenuProps) {
  if (!open) return null;
  return (
    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-xl shadow-lg z-50 flex flex-col animate-pop" style={{ minWidth: "120px" }}>
      <button
        onClick={onEdit}
        className="py-3 px-4 font-medium text-sm hover:bg-gray-100 justify-center flex items-center rounded-t-xl border-b-white bg-[#3A8049] text-white"
      >
        게시글 수정
      </button>
      <button
        onClick={onDelete}
        className="py-3 px-4 font-medium text-sm text-white hover:bg-gray-100 justify-center rounded-b-xl flex items-center bg-[#3A8049]"
      >
        게시글 삭제
      </button>
    </div>
  );
}
