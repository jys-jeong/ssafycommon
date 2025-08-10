import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ 추가
import UserInput from '@/components/atoms/Inputs/UserInput'
import GradationButton from '@/components/atoms/Buttons/GradationButton'
import landscape3 from '@/assets/bgimages/landscape3.png'

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // ✅ 네비게이터

  const loginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 로그인 로직 (JWT 저장 등)
    navigate('/'); // 로그인 성공 시 홈으로 이동
  };

  const signupSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('/signup'); // 회원가입 페이지로 이동
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-900" 
      style={{
        backgroundImage: `url(${landscape3})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <form
        onSubmit={loginSubmit}
        className="relative form-with-bg bg-white/10 backdrop-blur-md p-6 rounded-3xl w-80"
      >
        <h2 className="text-black text-center text-2xl font-bold mb-6">
          로그인
        </h2>

        <UserInput
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          required
        />
        <UserInput
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          required
        />

        <div className="mt-6 space-y-2">
          <GradationButton type="submit" variant="green">
            로그인
          </GradationButton>
          <GradationButton type="button" variant="black" onClick={signupSubmit}>
            회원가입
          </GradationButton>
        </div>

        <div className="text-right">
          <button
            type="button"
            className="text-white text-sm underline hover:text-green-200 transition bg-transparent"
            onClick={() => navigate('/password/Forget')} // 비밀번호 찾기 페이지 예시
          >
            비밀번호 찾기
          </button>
        </div>
      </form>
    </div>
  );
}
