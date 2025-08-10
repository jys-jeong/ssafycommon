import { library } from "@fortawesome/fontawesome-svg-core";
//fontawesome icons 참조할 아이콘 import에 추가
import {
  faHouse,
  faTrophy,
  faUser,
  faCartShopping,
  faPlusSquare,
  faHeart as faHeartSolid,
  faBookmark as faBookmarkSolid,
  faEllipsisVertical,
  faPersonRunning,
  faMagnifyingGlass,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";

import {
  faComment,
  faHeart as faHeartRegular,
  faBookmark as faBookmarkRegular,
} from "@fortawesome/free-regular-svg-icons";
// 추가한 아이콘 library에 등록
library.add(
  faHouse,
  faTrophy,
  faUser,
  faCartShopping,
  faPlusSquare,
  faHeartSolid,
  faHeartRegular,
  faComment,
  faBookmarkSolid,
  faEllipsisVertical,
  faBookmarkRegular,
  faPersonRunning,
  faMagnifyingGlass,
  faArrowUp
);
