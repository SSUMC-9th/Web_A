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
      const urlParams = new URLSearchParams(window.location.search);
      const isGoogleCallback =
        urlParams.get("accessToken") && urlParams.get("refreshToken");

      // Google 콜백이 아닌 경우에만 리디렉션 (알림 없이)
      if (!isGoogleCallback) {
        navigate("/", { replace: true });
      }
    }
  }, [accessToken, navigate]);

  // Google OAuth 콜백 처리
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const googleAccessToken = urlParams.get("accessToken");
    const googleRefreshToken = urlParams.get("refreshToken");

    if (googleAccessToken && googleRefreshToken) {
      // Google 로그인 성공 - 토큰 저장
      localStorage.setItem(
        LOCAL_STORAGE_KEY.accessToken,
        JSON.stringify(googleAccessToken)
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEY.refreshToken,
        JSON.stringify(googleRefreshToken)
      );

      // 루트 페이지로 리디렉션
      navigate("/", { replace: true });
    }
  }, [navigate]);
  const { values, errors, touched, getInputProps } =
    useForm<UserSignInInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleSubmit = async () => {
    // 정상 로그인 시에는 기존 토큰을 제거하고 새로 로그인
    localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
    localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);

    await login(values);
    navigate("/");
  };

  const handleGoogleLogin = () => {
    // 기존 토큰을 임시로 제거하여 리디렉션 방지
    const currentToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    const currentRefreshToken = localStorage.getItem(
      LOCAL_STORAGE_KEY.refreshToken
    );

    // 토큰을 임시 저장
    sessionStorage.setItem("temp_access_token", currentToken || "");
    sessionStorage.setItem("temp_refresh_token", currentRefreshToken || "");

    // 토큰 제거
    localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
    localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);

    const serverUrl =
      import.meta.env.VITE_SERVER_API_URL || "http://localhost:8000";
    const googleLoginUrl = `${serverUrl}/v1/auth/google/login?prompt=select_account`;
    window.location.href = googleLoginUrl;
  };
  const isDisabled: boolean =
    Object.values(errors || {}).some((error: string) => error.length > 0) || // 에러가 있으면 true
    Object.values(values).some((value: string) => value === ""); // 값이 비어있으면 true

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col gap-3">
        <input
          {...getInputProps("email")}
          name="email"
          className="border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-md bg-white text-gray-900"
          type="email"
          placeholder="이메일을 입력해주세요."
        />
        {errors.email && touched.email && (
          <p className="text-red-500">{errors.email}</p>
        )}
        <input
          {...getInputProps("password")}
          name="password"
          className="border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-md bg-white text-gray-900"
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
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="text-white p-[10px] rounded-md transition-colors duration-200 bg-[#807bff] hover:bg-[#605bff] cursor-pointer"
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
