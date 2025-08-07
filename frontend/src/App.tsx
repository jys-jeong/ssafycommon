import { useState } from 'react';
import './App.css';
import GlobalStyle from '@/utils/globalFont';
import '@/libs/fontawesome';
import SignupPage from '@/components/pages/Signup';
import Home from '@/components/pages/Home';
export default function App() {
  return (
    <div>
      <GlobalStyle />
      {/* <SignupPage /> */}
      <SignupPage />
    </div>
  );
}
