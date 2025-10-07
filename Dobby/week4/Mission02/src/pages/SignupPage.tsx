import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { postSignup } from "../apis/auth";

const schema = z
  .object({
    email: z.string().email({ message: "이메일 형식이 올바르지 않습니다." }),
    password: z
      .string()
      .min(8, {
        message: "비밀번호는 8자 이상이여 합니다.",
      })
      .max(20, {
        message: "비밀번호는 20자 이하여야 합니다.",
      }),
    passwordCheck: z
      .string()
      .min(8, {
        message: "비밀번호는 8자 이상이여 합니다.",
      })
      .max(20, {
        message: "비밀번호는 20자 이하여야 합니다.",
      }),
    name: z.string().min(1, { message: "이름은 입력해주세요." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      passwordCheck: "",
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
    shouldUnregister: false,
  });

  const email = watch("email");
  const password = watch("password");
  const passwordCheck = watch("passwordCheck");
  const name = watch("name");

  const gotoNextFromEmail = async () => {
    const valid = await trigger("email");
    if (valid) setStep(2);
  };

  const gotoNextFromPassword = async () => {
    const valid = await trigger(["password", "passwordCheck"]);
    if (valid) setStep(3);
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordCheck: _pc, ...rest } = data;
    try {
      const response = await postSignup(rest);
      console.log(response);
      navigate("/login", { replace: true });
    } catch (e) {
      // 실패 시에는 그대로 머물면서 브라우저 알림만 표시
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      alert((e as any)?.message ?? "회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-[360px] text-white">
        <div className="flex items-center gap-2 mb-6">
          <button
            aria-label="뒤로가기"
            onClick={() =>
              step > 1 ? setStep((s) => (s === 1 ? 1 : ((s - 1) as 1 | 2 | 3))) : navigate(-1)
            }
            className="h-7 w-7 flex items-center justify-center rounded hover:bg-zinc-800 text-zinc-300"
          >
            {"<"}
          </button>
          <h1 className="text-lg font-semibold">회원가입</h1>
        </div>

        {step === 1 && (
          <div>
            <button
              type="button"
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

            <input
              {...register("email")}
              className={`w-full h-10 px-3 rounded-md bg-zinc-900 border ${
                errors?.email ? "border-red-500 bg-red-900/30" : "border-zinc-700"
              } placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              type="email"
              placeholder="이메일을 입력해주세요!"
            />
            {errors.email && (
              <div className="text-red-400 text-xs mt-1">{errors.email.message}</div>
            )}

            <button
              type="button"
              onClick={gotoNextFromEmail}
              disabled={!email || !!errors.email}
              className="w-full h-10 rounded-md mt-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-700/50 text-sm"
            >
              다음
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-3">
            <div className="h-10 px-3 rounded-md bg-zinc-900 border border-zinc-700 flex items-center justify-between text-sm text-zinc-300">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-xs">✉</span>
                <span className="truncate">{email}</span>
              </div>
              <span className="text-emerald-400">✔</span>
            </div>

            <div className="relative">
              <input
                {...register("password")}
                className={`w-full h-10 px-3 pr-10 rounded-md bg-zinc-900 border ${
                  errors?.password ? "border-red-500 bg-red-900/30" : "border-zinc-700"
                } placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력해주세요!"
              />
              <button
                type="button"
                aria-label="비밀번호 보기"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              >
                {showPassword ? "👁" : "🙈"}
              </button>
            </div>
            {errors.password && (
              <div className="text-red-400 text-xs -mt-2">{errors.password.message}</div>
            )}

            <div className="relative">
              <input
                {...register("passwordCheck")}
                className={`w-full h-10 px-3 pr-10 rounded-md bg-zinc-900 border ${
                  errors?.passwordCheck ? "border-red-500 bg-red-900/30" : "border-zinc-700"
                } placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                type={showPasswordCheck ? "text" : "password"}
                placeholder="비밀번호를 다시 한 번 입력해주세요!"
              />
              <button
                type="button"
                aria-label="비밀번호 확인 보기"
                onClick={() => setShowPasswordCheck((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              >
                {showPasswordCheck ? "👁" : "🙈"}
              </button>
            </div>
            {errors.passwordCheck && (
              <div className="text-red-400 text-xs -mt-2">{errors.passwordCheck.message}</div>
            )}

            <button
              type="button"
              onClick={gotoNextFromPassword}
              disabled={!password || !passwordCheck || !!errors.password || !!errors.passwordCheck}
              className="w-full h-10 rounded-md bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-700/50 text-sm"
            >
              다음
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="w-28 h-28 rounded-full bg-zinc-800 mx-auto mb-5 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-zinc-600" />
            </div>

            <input
              {...register("name")}
              className={`w-full h-10 px-3 rounded-md bg-zinc-900 border ${
                errors?.name ? "border-red-500 bg-red-900/30" : "border-zinc-700"
              } placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              type="text"
              placeholder="이름을 입력해주세요!"
            />
            {errors.name && <div className="text-red-400 text-xs mt-1">{errors.name.message}</div>}

            <button
              disabled={isSubmitting || !name}
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="w-full h-10 mt-4 rounded-md bg-pink-600 hover:bg-pink-500 disabled:bg-pink-600/50 text-sm"
            >
              회원가입 완료
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
