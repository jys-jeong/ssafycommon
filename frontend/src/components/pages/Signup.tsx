import { useState, useRef } from 'react';
import UserInput from '@/components/atoms/Inputs/UserInput'
import EssentialUserInput from '@/components/atoms/Inputs/EssentialUserInput';
import RegionInput from '@/components/atoms/Inputs/ResionInput';
import GradationButton from '@/components/atoms/Buttons/GradationButton'
import SmallButton from '@/components/atoms/Buttons/SmallButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import landscape3 from '@/assets/bgimages/landscape3.png'
import RegionDropdown from '@/components/molecules/regionDropdown';
import bjdJson from '@/assets/bjdcode/bjd.json';
import {
  getSidoList,
  getSigunguList,
  getEupmyeondongList,
  getAreaCode
} from '@/utils/regionUtils';


export default function SignupPage() {
	const areaData = bjdJson.area;
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [name, setName] = useState('')
	const [nickname, setNickname] = useState('')
	const [preview, setPreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [profile, setProfile] = useState<File | null>(null);
	// 백엔드랑 연결할 때 사용할 요소 profile
	
	const [regions, setRegions] = useState([
		{ label: '관심지역이름', sido: '', sigungu: '', eupmyeondong: '', areaCode: '' }
	]);

	const handleAddRegion = () => {
		if (regions.length < 3) {
			setRegions([...regions, { label: '관심지역이름', sido: '', sigungu: '', eupmyeondong: '', areaCode: '' }]);
		}
  };

	 const handleRemoveRegion = (index: number) => {
		if (regions.length > 1) {
			const newRegions = [...regions];
			newRegions.splice(index, 1);
			setRegions(newRegions);
		}
  };

	const handleRegionChange = (index: number, field: string, value: string) => {
		const newRegions = [...regions];
		const region = { ...newRegions[index], [field]: value };

		// 상위 선택 변경 시 하위 항목 초기화
		if (field === 'sido') {
			region.sigungu = '';
			region.eupmyeondong = '';
			region.areaCode = '';
		} else if (field === 'sigungu') {
			region.eupmyeondong = '';
			region.areaCode = '';
		} else if (field === 'eupmyeondong') {
			const code = getAreaCode(areaData, region.sido, region.sigungu, value);
			region.areaCode = code ?? '';
		}

		newRegions[index] = region;
		setRegions(newRegions);
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setProfile(file);
			setPreview(URL.createObjectURL(file));
		}
  };

	const handleClickUpload = () => {
		fileInputRef.current?.click();
	};

	const removeImage = () => {
		setProfile(null);
		setPreview(null);

		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
  };

	const signupSubmit = (e: React.FormEvent) => {
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
				onSubmit={signupSubmit}
				className="bg-white/10 form-with-bg backdrop-blur-md py-4 px-4 rounded-3xl w-80"
			>
				<h2 className="text-black text-center text-2xl font-bold mb-6">회원가입</h2>

				<div className='px-2'>
					<EssentialUserInput
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						label={
							<>
								E-mail<span className="text-yellow-400">*</span>
							</>
						}
						required
					/>
					<EssentialUserInput
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						label={
							<>
								비밀번호<span className="text-yellow-400">*</span>
							</>
						}
						required
					/>
					<EssentialUserInput
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						label={
							<>
								비밀번호 확인<span className="text-yellow-400">*</span>
							</>
						}
						required
					/>
					<EssentialUserInput
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						label={
							<>
								이름<span className="text-yellow-400">*</span>
							</>
						}
						required
					/>
					<UserInput
						type="text"
						value={nickname}
						onChange={(e) => setNickname(e.target.value)}
						placeholder="별명"
						required
					/>
				</div>

				<div className='text-left'>
					<p className="text-black font-bold">
						관심지역<span className="text-yellow-500">*</span> <span className='text-[12px]'>최소 1개 · 최대 3개</span>
					</p> 

					{regions.map((region, index) => (
						<div key={index}>
							<RegionInput
								type="text"
								value={region.label}
								placeholder="관심지역이름"
								onChange={(e) => handleRegionChange(index, 'label', e.target.value)}
							/>

							<div className="space-y-1 mt-1">
								<div className="flex items-center space-x-1">
									<RegionDropdown
										options={getSidoList(areaData)}
										selected={region.sido || "시/도"}
										onSelect={(value) => handleRegionChange(index, 'sido', value)}
									/>

									<RegionDropdown
										options={region.sido ? getSigunguList(areaData, region.sido) : []}
										selected={region.sigungu || "군/구"}
										onSelect={(value) => handleRegionChange(index, 'sigungu', value)}
									/>

									<RegionDropdown
										options={
											region.sido && region.sigungu
												? getEupmyeondongList(areaData, region.sido, region.sigungu)
												: []
										}
										selected={region.eupmyeondong || "읍/면/동"}
										onSelect={(value) => handleRegionChange(index, 'eupmyeondong', value)}
									/>
								</div>

								<div className="flex space-x-1 ml-1 mr-3">
									{regions.length < 3 && (
										<SmallButton variant="green" onClick={handleAddRegion}>추가</SmallButton>
									)}
									{regions.length > 1 && (
										<SmallButton variant="red" onClick={() => handleRemoveRegion(index)}>제거</SmallButton>
									)}
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="flex items-center space-x-3 mt-3">
					<div className="relative w-[80px] h-[80px] rounded-full bg-black/40 flex items-center justify-center border border-1 border-white/50">
						{preview ? (
							<>
								<img
									src={preview}
									alt="프로필 미리보기"
									className="w-[80px] h-[80px] object-cover rounded-full border border-1 border-white/50"
								/>
								<button
									onClick={removeImage}
									className="absolute top-1 right-[-3px] w-5 h-5 bg-[#E36D6D] text-white rounded-full flex items-center justify-center text-sm px-0"
								>
									×
								</button>
							</>
						) : (
							<FontAwesomeIcon icon={faUser} size="2x" className="text-white" />
						)}
					</div>

					<div>
						<input
							type="file"
							accept="image/*"
							id="profile-upload"
							onChange={handleImageChange}
							ref={fileInputRef}
							className='hidden'
						/>
						<GradationButton
							className="w-[60px] h-[32px] rounded-xl mt-8 ml-2"
							type="button"
							variant="green"
							onClick={handleClickUpload}
						>
							업로드
						</GradationButton>
					</div>
				</div>

				<div className="mt-6 flex flex-col items-center space-y-2 text-center">
					<GradationButton type="submit" variant="green" onClick={signupSubmit}>회원가입</GradationButton>
					<GradationButton type="button" variant="black" onClick={handleCancel}>취소</GradationButton>
				</div>

			</form>
		</div>
	);
}