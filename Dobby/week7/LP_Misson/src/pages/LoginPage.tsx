import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { type UserSigninInformation, validateSignin } from "../utils/vaildate";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const LoginPage = () => {
  const { login,accessToken } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [accessToken, navigate]);
  const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: validateSignin,
  });

  const handleSubmit = async () => {
    await login(values);
  };

  const handleGoogleLogin = () => { 
    window.location.href = import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  }

  //오류가 하나라도 있거나, 입력값이 비어있으면 버튼을 비활성화
  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) || //오류가 있으면 true;
    Object.values(values).some((value) => value === ""); //입력값이 비어있으면 true;
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-[340px] text-white">
        <div className="flex items-center gap-2 mb-6">
          <button
            aria-label="뒤로가기"
            onClick={() => navigate(-1)}
            className="h-7 w-7 flex items-center justify-center rounded hover:bg-zinc-800 text-zinc-300"
          >
            {"<"}
          </button>
          <h1 className="text-lg font-semibold">로그인</h1>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full h-10 border border-zinc-700 rounded-md flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800"
        >
          <span className="h-4 w-4 rounded-sm bg-white text-black text-[10px] font-bold flex items-center justify-center">
            G
          </span>
          <span className="text-sm">구글 로그인</span>
        </button>

        <div className="flex items-center gap-3 my-5 text-zinc-400 text-xs">
          <div className="h-px bg-zinc-800 flex-1" />
          <span>OR</span>
          <div className="h-px bg-zinc-800 flex-1" />
        </div>

        <div className="flex flex-col gap-3">
          <input
            {...getInputProps("email")}
            className={`w-full h-10 px-3 rounded-md bg-zinc-900 border ${
              errors?.email && touched?.email ? "border-red-500 bg-red-900/30" : "border-zinc-700"
            } placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            type={"email"}
            placeholder={"이메일을 입력해주세요!"}
          />
          {errors?.email && touched?.email && (
            <div className="text-red-400 text-xs">{errors.email}</div>
          )}

          <input
            {...getInputProps("password")}
            className={`w-full h-10 px-3 rounded-md bg-zinc-900 border ${
              errors?.password && touched?.password
                ? "border-red-500 bg-red-900/30"
                : "border-zinc-700"
            } placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            type={"password"}
            placeholder={"비밀번호를 입력해주세요!"}
          />
          {errors?.password && touched?.password && (
            <div className="text-red-400 text-xs">{errors.password}</div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isDisabled}
            className="w-full h-10 rounded-md bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-700/50 text-sm"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
