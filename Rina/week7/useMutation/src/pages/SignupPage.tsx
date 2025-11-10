import { useNavigate } from "react-router-dom"
import { useForm } from "../hooks/useForm";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useState } from "react";
import {z} from "zod";
import type { ApiError } from "../apis/axios";
import { postSignup } from "../apis/auth";

export default function SignupPage(){
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // localStorage에 저장할 전체 가입 정보
    const [signupData, setSignupData] = useLocalStorage("signupData", {
        email: "",
        password: "",
        nickname: "",
    });

    // Zod 스키마 정의
    const emailSchema = z.object({
        email: z.string().email("유효하지 않은 이메일 형식"),
    });

    const passwordSchema = z
        .object({
            password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
            confirmPassword : z.string(),
        })
        .refine((data)=> data.password === data.confirmPassword, {
            message: "비밀번호가 일치하지 않습니다.",
            path: ["confirmPassword"],
        });

    const nicknameSchema = z.object({
        nickname: z.string().min(1, "닉네임을 입력하세요."),
    });

    // 유효성 검사
    // step 1 : email
    const validateEmail = (values: {email:string}) => {
        const result = emailSchema.safeParse(values);
        return result.success ? {} : { email: result.error.issues[0].message};
    };

    // step 2 : password
    const validatePassword = (values: {password : string; confirmPassword:string}) => {
        const result = passwordSchema.safeParse(values);
        if (result.success) return {};
        const errors : Partial <Record<keyof typeof values, string>> = {};
        result.error.issues.forEach((err) => {
            const field = err.path[0] as keyof typeof values;
            errors[field] = err.message;
        });
        return errors;
    }

    // step 3: nickname
    const validateNickname = (values: {nickname : string }) => {
        const result = nicknameSchema.safeParse(values);
        return result.success ? {} : {nickname: result.error.issues[0].message};
    }

    // useForm - email
    const {
        values: emailValues,
        errors: emailErrors,
        touched: emailTouched,
        handleChange: handleEmailChange,
        isValid : isEmailValid,
    } = useForm( {email:""}, validateEmail );

    // useForm - pw
    const {
        values: pwValues,
        errors: pwErrors,
        touched: pwTouched,
        handleChange: handlePwChange,
        isValid : isPwValid,
    } = useForm( {password:"", confirmPassword:""}, validatePassword );

    // useForm - nickname
    const {
        values: nicknameValues,
        errors: nicknameErrors,
        touched: nicknameTouched,
        handleChange: handleNicknameChange,
        isValid : isNicknameValid,
    } = useForm( {nickname:""}, validateNickname );


    // handler - email
    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // 이메일이 유효성 검사 통과하면
        if (isEmailValid){
            // localStorage에 이메일 저장함
            setSignupData({...signupData, email: emailValues.email});
            setStep(2);
        }
    };

    // handler - pw
    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isPwValid) {
            setSignupData({
                ...signupData,
                password: pwValues.password,
            });
            setStep(3);
        }
    };

    // handler - nickname
    const handleNicknameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isNicknameValid) return;

        try {
            const body = {
                name: nicknameValues.nickname,
                email: signupData.email,
                password: signupData.password,
            };

            await postSignup(body);

            //회원 가입 완료 후 로그인 페이지로 이동
            navigate("/login");
        }
        catch (e) {
            const err=  e as ApiError;
            const msg = err.response?.data?.message ?? err.message ?? "회원가입에 실패했습니다.";
            alert(msg);
            console.error("signup error:", err.response ?? err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="w-full max-w-md">

                <div className="flex items-center justify-between mb-8">
                    {/* 뒤로 가기 버튼 */}
                    <button
                        onClick={() => (step === 1 ? navigate(-1) : setStep(step -1))}
                        className="px-3 py-1 text-white hover:text-green-400 hover:bg-gray-200 hover:rounded transition">
                            &lt;
                    </button>

                    <h1 className="text-center text-4xl font-bold flex-1">회원가입</h1>
                </div>

                {/* Step 1 : 이메일 입력 */}
                {step === 1 && (
                    <>
                        {/* 구글 회원가입 */}
                        <button className="w-full border border-gray-400 rounded p-2 flex items-center justify-center mb-4 hover:bg-gray-200 hover:text-gray-700">
                            <img
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt="Google" 
                                className="w-5 h-5"    
                            />
                            구글 계정으로 회원가입
                        </button>

                        {/* OR */}
                        <div className="flex items-center mb-4">
                            <div className="flex-1 h-px bg-gray-500"></div>
                            <span className="px-2 text-gray-400">OR</span>
                            <div className="flex-1 h-px bg-gray-500"></div>
                        </div>  

                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <input
                            name="email"
                            type="email"
                            placeholder="이메일 입력"
                            value={emailValues.email}
                            onChange={handleEmailChange}
                            className="w-full p-2 rounded border-gray-300"
                        />

                        {emailTouched.email && emailErrors.email && (
                            <p className="text-red-400 text-sm">{emailErrors.email}</p>
                        )}

                        {/* 넘어가는 버튼 */}
                        <button
                            type="submit"
                            disabled={!isEmailValid}
                            className={`w-full p-2 rounded ${
                                isEmailValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-300"
                            }`}
                        >
                            다음
                        </button>
                    </form>
                    </>

                )}

                {/* Step 2 : 비밀번호 입력 */}
                {step === 2 && (
                    <div>
                        <div className="text-gray-200 text-sm mb-2">
                            <span>✉ {signupData.email}</span>
                        </div>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="비밀번호 입력"
                                    value={pwValues.password}
                                    onChange={handlePwChange}
                                    className="w-full p-2 rounded border-gray-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600"
                                >
                                    {showPassword ? "👁️" : "🕶️"}
                                </button>

                                {pwTouched.password && pwErrors.password && (
                                    <p className="text-red-400 text-sm">{pwErrors.password}</p>
                                )}
                            </div>

                            <div className="relative">
                                <input 
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="비밀번호 재확인"
                                    value={pwValues.confirmPassword}
                                    onChange={handlePwChange}
                                    className="w-full p-2 rounded text-gray-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600"
                                >
                                    {showConfirmPassword ? "👁️" : "🕶️"}
                                </button>
                                {pwTouched.confirmPassword && pwErrors.confirmPassword && (
                                    <p className="text-red-400 text-sm">{pwErrors.confirmPassword}</p>
                                )}
                            </div>


                            {/* 넘어가는 버튼 */}
                            <button
                                type="submit"
                                disabled={!isPwValid}
                                className={`w-full p-2 rounded ${
                                    isPwValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-300"
                                }`}
                            >
                                다음
                            </button>
                        </form>
                    </div>
                )}

                {/* step 3 : 닉네임 */}
                { step === 3 && (
                    <form onSubmit={handleNicknameSubmit} className="space-y-4">
                        {/* 프로필 이미지 */}
                        <div className="flex flex-col items-center mb-4">
                            <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center">
                                <span className="text-gray-400 text-sm">프로필</span>
                            </div>
                            <p className="text-gray-400 text-xs mt-1">프로필 이미지는 선택 사항</p>
                        </div>

                        <input
                            name="nickname"
                            type="text"
                            placeholder="닉네임 입력"
                            value={nicknameValues.nickname}
                            onChange={handleNicknameChange}
                            className="w-full p-2 rounded text-gray-300"
                        />
                        { nicknameTouched.nickname && nicknameErrors.nickname && (
                            <p className="text-red-400 text-sm">{nicknameErrors.nickname}</p>
                        )}
                        <button
                            type="submit"    
                            disabled={!isNicknameValid}
                            className={`w-full p-2 rounded ${
                                isNicknameValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-300"
                            }`}
                        >
                            회원 가입 완료 &gt; 로그인 페이지로 이동
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
};