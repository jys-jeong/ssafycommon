import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ 추가
import UserInput from '@/components/atoms/Inputs/UserInput';
import GradationButton from '@/components/atoms/Buttons/GradationButton';
import landscape3 from '@/assets/bgimages/landscape3.png';

export default function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate(); // ✅ 네비게이터 생성

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 비밀번호 찾기 API 호출
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('/login'); // ✅ 올바른 페이지 이동
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
        onSubmit={handleSubmit}
        className="relative form-with-bg bg-white/10 backdrop-blur-md p-6 rounded-3xl w-80"
      >
        <h2 className="text-black text-center text-2xl font-bold mb-6">
          비밀번호 찾기
        </h2>
        <UserInput
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          required
        />
        <UserInput
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          required
        />

        <div className="mt-6 space-y-2">
          <GradationButton type="submit" variant="green" onClick={handleSubmit}>
            링크 전송
          </GradationButton>
          <GradationButton type="button" variant="black" onClick={handleCancel}>
            취소
          </GradationButton>
        </div>
      </form>
    </div>
  );
}
