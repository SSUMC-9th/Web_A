import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, type LoginFormType } from '../schemas/authSchema';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<LoginFormType>({
        resolver: zodResolver(loginFormSchema),
        mode: 'onChange',
    });

    const handleGoBack = () => {
        navigate(-1);
    };

    const onSubmit = async (data: LoginFormType) => {
        try {
            await login({
                email: data.email,
                password: data.password,
            });

            // 로그인 성공 후 즉시 네비게이션 (AuthContext에서 alert 후)
            setTimeout(() => {
                const from = (location.state as any)?.from?.pathname || '/';
                navigate(from, { replace: true });
            }, 100); // alert 후 약간의 딜레이
        } catch (error) {
            // 에러는 AuthContext의 login 함수에서 처리됨
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* 헤더 - 뒤로 가기 버튼 */}
            <div className="flex items-center p-4">
                <button
                    onClick={handleGoBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="뒤로 가기"
                >
                    <svg
                        className="w-6 h-6 text-gray-800"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>
            </div>

            {/* 로그인 폼 - 첨부 이미지와 비슷한 단순한 스타일 */}
            <div className="flex items-center justify-center px-4 pt-16">
                <div className="w-full max-w-sm mx-auto">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* 이메일 입력 필드 */}
                        <div>
                            <input
                                {...register('email')}
                                id="email"
                                type="email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-gray-700"
                                placeholder="이메일"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        {/* 비밀번호 입력 필드 */}
                        <div>
                            <input
                                {...register('password')}
                                id="password"
                                type="password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-gray-700"
                                placeholder="비밀번호"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        {/* 로그인 버튼 */}
                        <button
                            type="submit"
                            disabled={!isValid}
                            className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${isValid
                                ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                                : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            로그인
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;