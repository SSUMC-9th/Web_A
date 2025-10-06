import React from "react";
import type { UserSignInInformation } from "../utils/validate";
import { validateSignin } from "../utils/validate";
import useForm from "../hooks/useForm";
import { postSignin } from "../apis/auth";
import { useLocalStorage } from "../hooks/useLocalStorage.tsx";
import type { ResponseSignInDto } from "../src/types/common";
import { LOCAL_STORAGE_KEY } from "../constants/key";

const LoginPage = () => {
  const { setItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const { values, errors, touched, getInputProps } =
    useForm<UserSignInInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleSubmit = async () => {
    console.log(values);
    try {
      const response: ResponseSignInDto = await postSignin(values);
      console.log("로그인 응답:", response);
      console.log("저장할 토큰:", response.data.accessToken);

      setItem(response.data.accessToken);
      console.log("setItem 호출 완료");

      // localStorage 직접 확인
      const savedToken = localStorage.getItem("accessToken");
      console.log("localStorage에 저장된 토큰:", savedToken);
    } catch (error) {
      console.error("로그인 실패:", error);
      alert(error?.message);
    }
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
                ? "bg-[#807bff]/50 cursor-not-allowed" // 반투명한 보라색 (비활성화)
                : "bg-[#807bff] hover:bg-[#605bff] cursor-pointer" // 정상적인 보라색 (활성화)
            }`}
          >
            로그인
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
