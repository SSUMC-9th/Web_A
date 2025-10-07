import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';

// 유효성 검사 규칙
const validationRules = {
    email: (value: string) => {
        if (!value) return '이메일을 입력해주세요.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return '이메일 에러';
        return null;
    },
    password: (value: string) => {
        if (!value) return '비밀번호를 입력해주세요.';
        if (value.length < 6) return '비밀번호는 최소 6자 이상이어야 합니다.';
        return null;
    }
};

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        validateForm,
        isFormValid
    } = useForm(
        { email: '', password: '' },
        validationRules
    );

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                alert('로그인 성공!');
                navigate('/');
            } else {
                const errorData = await response.json();
                alert(errorData.message || '로그인에 실패했습니다.');
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            alert('서버와의 연결에 문제가 발생했습니다.');
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
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* 이메일 입력 필드 */}
                        <div>
                            <input
                                id="email"
                                type="email"
                                value={values.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                onBlur={() => handleBlur('email')}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-gray-700"
                                placeholder="이메일"
                            />
                            {touched.email && errors.email && (
                                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        {/* 비밀번호 입력 필드 */}
                        <div>
                            <input
                                id="password"
                                type="password"
                                value={values.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                onBlur={() => handleBlur('password')}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-gray-700"
                                placeholder="비밀번호"
                            />
                            {touched.password && errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>

                        {/* 로그인 버튼 */}
                        <button
                            type="submit"
                            disabled={!isFormValid()}
                            className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
                                isFormValid()
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