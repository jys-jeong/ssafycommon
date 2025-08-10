import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import PersistAuth from "./PersistAuth";

import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";
import Home from "@/components/pages/Home";
import ForgetPassword from "@/components/pages/ForgetPassword";
import ChangePassword from "@/components/pages/ChangePassword";
import Profile from "@/components/pages/Profile";
import Rank from "@/components/pages/Rank";
import Map3D from "@/features/follow/map/Map3D";
export default function AppRouter() {
  const location = useLocation();
  const state = location.state as { background?: Location };
  const background = state?.background;

  return (
    <PersistAuth>
      {/* 기본 렌더 (배경) */}
      <Routes location={background || location}>
        {/* 공개 라우트 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 비밀번호 재설정: 공개 + 토큰검증 필요 */}
        {/* 예: /password/reset?token=... 혹은 /password/change/:token */}
        <Route path="/password/change" element={<ChangePassword />} />
        <Route path="/password/Forget" element={<ForgetPassword />} />
        <Route path="/myprofile" element={<Profile />} />
        <Route path="/rank" element={<Rank />} />
        <Route path="/" element={<Map3D/>} />
        {/* 홈 페이지 */}
        <Route path="/follow" element={<Home />} />
        {/* 보호 라우트 */}
        <Route element={<RequireAuth />}></Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </PersistAuth>
  );
}
