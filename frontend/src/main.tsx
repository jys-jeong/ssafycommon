// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )



import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "@/router/AppRouter";
import './libs/fontawesome'
import "./index.css"; // Tailwind 엔트리
import './App.css';
import GlobalStyle from "@/utils/globalFont";
createRoot(document.getElementById("root")!).render(
  <>
    <GlobalStyle />
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </>
);
