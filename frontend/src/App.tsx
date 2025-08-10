import { useState } from "react";
import "./App.css";
import GlobalStyle from "@/utils/globalFont";
import "@/libs/fontawesome";
import SignupPage from "@/components/pages/Signup";
import Home from "@/components/pages/Home";
import Login from "./components/pages/Login";
import Profile from "./components/pages/Profile"
import Map3D from "./features/follow/map/Map3D";
export default function App() {
  return (
    <div>
      <GlobalStyle />
      {/* <SignupPage /> */}
      <Map3D />
    </div>
  );
}