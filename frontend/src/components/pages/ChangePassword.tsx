import { useState } from 'react';
import UserInput from '@/components/atoms/Inputs/UserInput'
import GradationButton from '@/components/atoms/Buttons/GradationButton'
import landscape3 from '@/assets/bgimages/landscape3.png'

export default function ChangePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-900" 
      style={{ backgroundImage: `url(${landscape3})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
    >
      <form
        onSubmit={handleSubmit}
        className="relative form-with-bg bg-white/10 backdrop-blur-md p-6 rounded-3xl w-80"
      >
        <h2 className="text-black text-center text-2xl font-bold mb-6">
          비밀번호 재설정
        </h2>
        <UserInput
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          required
        />
        <UserInput
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="비밀번호 확인"
          required
        />

        <div className="mt-6 space-y-2">
          <GradationButton type="submit" variant="green" onClick={handleSubmit}>
            비밀번호 재설정
          </GradationButton>
          <GradationButton type="button" variant="black" onClick={handleCancel}>
            취소
          </GradationButton>
        </div>
      </form>
    </div>
  );
}
