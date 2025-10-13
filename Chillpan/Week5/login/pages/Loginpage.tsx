import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { UserSignInInformation } from "../utils/validate";
import { validateSignin } from "../utils/validate";
import useForm from "../hooks/useForm";
import { postSignin } from "../apis/auth";
import { useLocalStorage } from "../hooks/useLocalStorage.tsx";
import type { ResponseSignInDto } from "../src/types/common";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useAuth } from "../src/context/AuthContext";

const LoginPage = () => {
  const { login, accessToken } = useAuth();
  const navigate = useNavigate();

  // 이미 로그인된 상태라면 홈페이지로 리디렉션
  useEffect(() => {
    if (accessToken) {
      navigate("/", { replace: true });
    }
  }, [accessToken, navigate]);
  const { values, errors, touched, getInputProps } =
    useForm<UserSignInInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleSubmit = async () => {
    await login(values);
    navigate("/mypage");
  };

  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };
  const isDisabled: boolean =
    Object.values(errors || {}).some((error: string) => error.length > 0) || // 에러가 있으면 true
    Object.values(values).some((value: string) => value === ""); // 값이 비어있으면 true

  return (
    <div className="min-h-screen flex flex-col">
      {/* 네비게이션 바 */}
      <nav className="bg-slate-800 text-white p-4 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-xl font-semibold">네비게이션 바 입니다.</h1>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col gap-3">
          <input
            {...getInputProps("email")}
            name="email"
            className="border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-md"
            type="email"
            placeholder="이메일을 입력해주세요."
          />
          {errors.email && touched.email && (
            <p className="text-red-500">{errors.email}</p>
          )}
          <input
            {...getInputProps("password")}
            name="password"
            className="border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-md"
            type="password"
            placeholder="비밀번호를 입력해주세요."
          />
          {errors.password && touched.password && (
            <p className="text-red-500">{errors.password}</p>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isDisabled}
            className={`text-white p-[10px] rounded-md transition-colors duration-200 ${
              isDisabled
                ? "bg-[#807bff]/50 cursor-not-allowed"
                : "bg-[#807bff] hover:bg-[#605bff] cursor-pointer"
            }`}
          >
            로그인
          </button>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="text-white p-[10px] rounded-md transition-colors duration-200 bg-[#807bff] hover:bg-[#605bff] cursor-pointer"
          >
            구글 로그인
          </button>
        </div>
      </main>

      {/* 광고 배너 */}
      <footer className="bg-slate-700 text-white p-4 shadow-lg">
        <div className="container mx-auto text-center">
          <p>광고 배너</p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
