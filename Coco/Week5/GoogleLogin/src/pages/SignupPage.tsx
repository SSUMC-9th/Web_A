import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail, validatePassword, validateNickname } from '../utils/validate' ;
import { Eye, EyeOff, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import React from "react";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  
  // Form values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  
  // Touched states
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [nicknameTouched, setNicknameTouched] = useState(false);
  
  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation
  const emailErrors = validateEmail(email);
  const passwordErrors = validatePassword(password, confirmPassword);
  const nicknameErrors = validateNickname(nickname);

  // Step 1: Email validation
  const isStep1Valid = email && !emailErrors.email;
  
  // Step 2: Password validation
  const isStep2Valid = password && confirmPassword && 
                       !passwordErrors.password && 
                       !passwordErrors.confirmPassword;
  
  // Step 3: Nickname validation
  const isStep3Valid = nickname && !nicknameErrors.nickname;

  const handleNextStep = () => {
    if (step === 1 && isStep1Valid) {
      setStep(2);
    } else if (step === 2 && isStep2Valid) {
      setStep(3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStep3Valid) {
      signup(email, password, nickname);
      console.log('회원가입 완료:', { email, password, nickname });
      alert('회원가입이 완료되었습니다!');
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            회원가입
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              로그인
            </Link>
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
            step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <div className={`w-12 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
            step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
          <div className={`w-12 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
            step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            3
          </div>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Email */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    이메일 주소
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      emailTouched && emailErrors.email
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="example@email.com"
                  />
                  {emailTouched && emailErrors.email && (
                    <p className="mt-2 text-sm text-red-600">{emailErrors.email}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!isStep1Valid}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition ${
                    isStep1Valid
                      ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  다음
                </button>
              </div>
            )}

            {/* Step 2: Password */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Display email */}
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">이메일:</span> {email}
                  </p>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    비밀번호
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => setPasswordTouched(true)}
                      className={`block w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        passwordTouched && passwordErrors.password
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {passwordTouched && passwordErrors.password && (
                    <p className="mt-2 text-sm text-red-600">{passwordErrors.password}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    비밀번호는 6자 이상 20자 이하여야 합니다.
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    비밀번호 확인
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => setConfirmPasswordTouched(true)}
                      className={`block w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        confirmPasswordTouched && passwordErrors.confirmPassword
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {confirmPasswordTouched && passwordErrors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!isStep2Valid}
                    className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition ${
                      isStep2Valid
                        ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    다음
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Nickname & Profile */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Display email */}
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">이메일:</span> {email}
                  </p>
                </div>

                {/* Profile Image (UI only) */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    프로필 이미지 변경 (준비중)
                  </button>
                </div>

                {/* Nickname */}
                <div>
                  <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                    닉네임
                  </label>
                  <input
                    id="nickname"
                    name="nickname"
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    onBlur={() => setNicknameTouched(true)}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      nicknameTouched && nicknameErrors.nickname
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="사용할 닉네임을 입력하세요"
                  />
                  {nicknameTouched && nicknameErrors.nickname && (
                    <p className="mt-2 text-sm text-red-600">{nicknameErrors.nickname}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    닉네임은 2자 이상 10자 이하여야 합니다.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    이전
                  </button>
                  <button
                    type="submit"
                    disabled={!isStep3Valid}
                    className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition ${
                      isStep3Valid
                        ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    회원가입 완료
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;