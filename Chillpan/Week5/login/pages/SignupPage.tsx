import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSignup } from "../apis/auth";

const schema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(8, {
        message: "비밀번호는 8자 이상이어야 합니다.",
      })
      .max(20, {
        message: "비밀번호는 20자 이하여야 합니다.",
      }),
    passwordCheck: z
      .string()
      .min(8, {
        message: "비밀번호는 8자 이상이어야 합니다.",
      })
      .max(20, {
        message: "비밀번호는 20자 이하여야 합니다.",
      }),
    name: z.string().min(1, { message: "이름을 입력해주세요." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(schema),
    mode: "onBlur", // 실시간 검증 활성화
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    console.log(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordCheck, ...rest } = data; // passwordCheck만 제외하고 출력

    const response = await postSignup(rest);

    console.log(response);
  };

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
            {...register("email")}
            className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
  ${errors?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
            type="email"
            placeholder="이메일을 입력해주세요."
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}

          <input
            {...register("password")}
            name="password"
            className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
  ${errors?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
            type="password"
            placeholder="비밀번호를 입력해주세요."
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}

          <input
            {...register("passwordCheck")}
            name="passwordCheck"
            className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
  ${errors?.passwordCheck ? "border-red-500 bg-red-200" : "border-gray-300"}`}
            type="password"
            placeholder="비밀번호를 다시 입력해주세요."
          />
          {errors.passwordCheck && (
            <p className="text-red-500">{errors.passwordCheck.message}</p>
          )}

          <input
            {...register("name")}
            className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
  ${errors?.name ? "border-red-500 bg-red-200" : "border-gray-300"}`}
            type="text"
            placeholder={"이름"}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          <button
            disabled={isSubmitting}
            type="button"
            onClick={handleSubmit(onSubmit)}
            className={`text-white p-[10px] rounded-md transition-colors duration-200 ${
              Object.keys(errors).length > 0
                ? "bg-[#807bff]/50 cursor-not-allowed" // 반투명한 보라색 (비활성화)
                : "bg-[#807bff] hover:bg-[#605bff] cursor-pointer" // 정상적인 보라색 (활성화)
            }`}
          >
            회원가입
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

export default SignupPage;
