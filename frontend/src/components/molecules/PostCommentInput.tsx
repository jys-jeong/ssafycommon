import berrycake from "@/assets/ghosts/berrycake.png";
import img from "@/assets/image.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function PostCommentInput() {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs">
        <img src={berrycake} alt="" className="w-full h-full object-cover" />
      </div>
      <input
        type="text"
        placeholder="댓글 달기..."
        className="flex-1 text-sm bg-[#E6E6E6] rounded-full h-[30px] p-[13px] border-none outline-none placeholder-gray-500"
        style={{
          marginLeft: "8px",
        }}
      />
      <button
        className="text-[#ffffff] font-semibold text-sm rounded-full h-[30px] px-3 bg-[#3A8049]"
        style={{
          marginLeft: "8px",
        }}
      >
        <FontAwesomeIcon icon="arrow-up" size="lg" />
      </button>
    </div>
  );
}
