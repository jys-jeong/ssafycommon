import { useState, useRef } from "react";
import UserInput from "@/components/atoms/Inputs/UserInput";
import EssentialUserInput from "@/components/atoms/Inputs/EssentialUserInput";
import RegionInput from "@/components/atoms/Inputs/ResionInput";
import GradationButton from "@/components/atoms/Buttons/GradationButton";
import SmallButton from "@/components/atoms/Buttons/SmallButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import landscape3 from "@/assets/bgimages/landscape3.png";
import RegionDropdown from "@/components/molecules/regionDropdown";
import { useBjdData } from "@/hooks/useBjdData";

import {
  getSidoList,
  getSigunguList,
  getEupmyeondongList,
  getAreaCode,
} from "@/utils/regionUtils";
import { signupRequest } from "@/api/auth";
import { useAuthStore } from "@/store/auth";
import { useNavigate } from "react-router-dom";

type Region = {
  label: string;
  sido: string;
  sigungu: string;
  eupmyeondong: string;
  areaCode: string;
};

export default function Signup() {
  const { areaData, loading } = useBjdData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [profile, setProfile] = useState<File | null>(null);
  const navigate = useNavigate();
  // 백엔드랑 연결할 때 사용할 요소 profile
  const setAuth = useAuthStore((s) => s.setAuth);
  const [regions, setRegions] = useState([
    {
      label: "관심지역이름",
      sido: "",
      sigungu: "",
      eupmyeondong: "",
      areaCode: "",
    },
  ]);

  if (loading) return null;

  const handleAddRegion = () => {
    if (regions.length < 3) {
      setRegions([
        ...regions,
        {
          label: "관심지역이름",
          sido: "",
          sigungu: "",
          eupmyeondong: "",
          areaCode: "",
        },
      ]);
    }
  };

  const handleRemoveRegion = (index: number) => {
    if (regions.length > 1) {
      const next = [...regions];
      next.splice(index, 1);
      setRegions(next);
    }
  };

  const handleRegionChange = (
    index: number,
    field: keyof Region,
    value: string
  ) => {
    const next = [...regions];
    const region = { ...next[index], [field]: value };

    // 상위 변경 시 하위 초기화
    if (field === "sido") {
      region.sigungu = "";
      region.eupmyeondong = "";
      region.areaCode = "";
    } else if (field === "sigungu") {
      region.eupmyeondong = "";
      region.areaCode = "";
    } else if (field === "eupmyeondong") {
      const code = getAreaCode(areaData, region.sido, region.sigungu, value);
      region.areaCode = code ?? "";
    }

    next[index] = region;
    setRegions(next);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleClickUpload = () => fileInputRef.current?.click();

  const removeImage = () => {
    setProfile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ✅ 유효성 검사 헬퍼
  const validate = () => {
    if (!email || !password || !confirmPassword || !name) {
      return "필수 항목을 모두 입력해주세요.";
    }
    if (password.length < 8) {
      return "비밀번호는 8자 이상으로 설정해주세요.";
    }
    if (password !== confirmPassword) {
      return "비밀번호가 일치하지 않습니다.";
    }
    if (regions.length < 1) {
      return "관심지역은 최소 1개 이상 선택해주세요.";
    }
    const invalid = regions.some(
      (r) =>
        !r.label.trim() ||
        !r.sido ||
        !r.sigungu ||
        !r.eupmyeondong ||
        !r.areaCode
    );
    if (invalid) {
      return "관심지역 정보를 모두 선택해주세요.";
    }
    return null;
  };

  // ✅ 최종 제출
  const signupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const v = validate();
    if (v) {
      setErrorMsg(v);
      return;
    }

    setErrorMsg(null);
    setSubmitting(true);
    try {
      const data = await signupRequest({
        email,
        password,
        name,
        nickname: nickname.trim() || undefined,
        profile,
        regions,
      });

      // 백엔드가 { user, accessToken }을 내려준다고 가정
      setAuth(data.user, data.accessToken);
      navigate("/"); // 홈으로 이동
    } catch (err: any) {
      console.error("회원가입 실패:", err);
      setErrorMsg(err?.response?.data?.message ?? "회원가입에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-900"
      style={{
        backgroundImage: `url(${landscape3})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <form
        onSubmit={signupSubmit}
        className="bg-white/10 form-with-bg backdrop-blur-md py-4 px-4 rounded-3xl w-80"
      >
        <h2 className="text-black text-center text-2xl font-bold mb-6">
          회원가입
        </h2>

        <div className="px-2 space-y-1">
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
          />
        </div>

        <div className="text-left mt-2">
          <p className="text-black font-bold">
            관심지역<span className="text-yellow-500">*</span>{" "}
            <span className="text-[12px]">최소 1개 · 최대 3개</span>
          </p>

          {regions.map((region, index) => (
            <div key={index} className="mb-2">
              <RegionInput
                type="text"
                value={region.label}
                placeholder="관심지역이름"
                onChange={(e) =>
                  handleRegionChange(index, "label", e.target.value)
                }
              />

              <div className="space-y-1 mt-1">
                <div className="flex items-center space-x-1">
                  <RegionDropdown
                    options={getSidoList(areaData)}
                    selected={region.sido || "시/도"}
                    onSelect={(value) =>
                      handleRegionChange(index, "sido", value)
                    }
                  />
                  <RegionDropdown
                    options={
                      region.sido ? getSigunguList(areaData, region.sido) : []
                    }
                    selected={region.sigungu || "군/구"}
                    onSelect={(value) =>
                      handleRegionChange(index, "sigungu", value)
                    }
                  />
                  <RegionDropdown
                    options={
                      region.sido && region.sigungu
                        ? getEupmyeondongList(
                            areaData,
                            region.sido,
                            region.sigungu
                          )
                        : []
                    }
                    selected={region.eupmyeondong || "읍/면/동"}
                    onSelect={(value) =>
                      handleRegionChange(index, "eupmyeondong", value)
                    }
                  />
                </div>

                <div className="flex space-x-1 ml-1 mr-3">
                  {regions.length < 3 && (
                    <SmallButton variant="green" onClick={handleAddRegion}>
                      추가
                    </SmallButton>
                  )}
                  {regions.length > 1 && (
                    <SmallButton
                      variant="red"
                      onClick={() => handleRemoveRegion(index)}
                    >
                      제거
                    </SmallButton>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-3 mt-3">
          <div className="relative w-[80px] h-[80px] rounded-full bg-black/40 flex items-center justify-center border border-white/50">
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="프로필 미리보기"
                  className="w-[80px] h-[80px] object-cover rounded-full border border-white/50"
                />
                <button
                  type="button"
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
              className="hidden"
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

        {errorMsg && <p className="mt-3 text-red-500 text-sm">{errorMsg}</p>}

        <div className="mt-6 flex flex-col items-center space-y-2 text-center">
          <GradationButton type="submit" variant="green" disabled={submitting}>
            {submitting ? "처리 중..." : "회원가입"}
          </GradationButton>
          <GradationButton type="button" variant="black" onClick={handleCancel}>
            취소
          </GradationButton>
        </div>
      </form>
    </div>
  );
}
