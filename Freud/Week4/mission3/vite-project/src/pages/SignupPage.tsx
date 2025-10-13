import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupFullSchema, type SignupFullType } from '../schemas/authSchema';
import { postSignup } from '../apis/auth';

const SignUpPage: React.FC = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<SignupFullType>({
        resolver: zodResolver(signupFullSchema),
        mode: 'onChange',
    });

    const handleGoBack = () => {
        navigate(-1);
    };

    const onSubmit = async (data: SignupFullType) => {
        console.log('=== 회원가입 시작 ===');
        console.log('입력 데이터:', data);
        
        const requestBody = {
            email: data.email,
            password: data.password,
            name: data.nickname,
        };
        console.log('전송할 데이터:', requestBody);
        
        try {
            const result = await postSignup({ body: requestBody });
            console.log('회원가입 성공 응답:', result);
            
            alert('회원가입이 완료되었습니다!');
            navigate('/');
        } catch (error: any) {
            console.error('=== 회원가입 오류 ===');
            console.error('전체 오류 객체:', error);
            
            if (error.response) {
                console.error('서버 응답 오류:');
                console.error('- 상태 코드:', error.response.status);
                console.error('- 상태 텍스트:', error.response.statusText);
                console.error('- 응답 데이터:', error.response.data);
                console.error('- 요청 URL:', error.config?.url);
                console.error('- 요청 메서드:', error.config?.method);
                
                let errorMessage = '회원가입에 실패했습니다.';
                
                if (error.response.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.status === 404) {
                    errorMessage = 'API 경로를 찾을 수 없습니다. 서버 설정을 확인해주세요.';
                } else {
                    errorMessage = `서버 오류 (${error.response.status}): ${error.response.statusText}`;
                }
                
                alert(errorMessage);
            } else if (error.request) {
                console.error('네트워크 오류:');
                console.error('- 요청 객체:', error.request);
                console.error('- 요청 URL:', error.config?.url);
                alert('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
            } else {
                console.error('요청 설정 오류:', error.message);
                alert(`요청 오류: ${error.message}`);
            }
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* 헤더 */}
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

            {/* 메인 폼 */}
            <div className="flex items-center justify-center px-4 pt-16">
                <div className="w-full max-w-sm mx-auto">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* 이메일 입력 */}
                        <div>
                            <input
                                {...register('email')}
                                type="email"
                                className="w-full px-4 py-3 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                placeholder="이메일"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        {/* 비밀번호 입력 */}
                        <div>
                            <input
                                {...register('password')}
                                type="password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-gray-700"
                                placeholder="비밀번호"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        {/* 비밀번호 확인 입력 */}
                        <div>
                            <input
                                {...register('passwordConfirm')}
                                type="password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-gray-700"
                                placeholder="비밀번호 확인"
                            />
                            {errors.passwordConfirm && (
                                <p className="mt-1 text-sm text-red-500">{errors.passwordConfirm.message}</p>
                            )}
                        </div>

                        {/* 닉네임 입력 */}
                        <div>
                            <input
                                {...register('nickname')}
                                type="text"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-gray-700"
                                placeholder="닉네임"
                            />
                            {errors.nickname && (
                                <p className="mt-1 text-sm text-red-500">{errors.nickname.message}</p>
                            )}
                        </div>

                        {/* 회원가입 버튼 */}
                        <button
                            type="submit"
                            disabled={!isValid}
                            className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${isValid
                                ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                                : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            회원가입
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;