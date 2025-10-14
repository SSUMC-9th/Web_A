import { useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm";

export default function LoginPage() {
    const navigate = useNavigate();

    // 유효성 검사 로직 정의하기
    const validate = (values: {email:string; password:string}) => {
        const errors: Partial<Record<keyof typeof values, string>> = {};

        // 이메일 형식 검사하기
        if (!values.email.includes("@") || !values.email.includes(".")) {
            errors.email = "유효하지 않은 이메일 형식입니다.";
        }

        // 비밀번호 길이 검사
        if (values.password.length < 6) {
            errors.password = "비밀번호는 최소 6자 이상이어야 합니다.";
        }
        return errors;
    };

    const {values, errors, touched, handleChange, isValid} = useForm(
        {email:"", password:""},
        validate
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;
        console.log("로그인 시도", values);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="w-full max-w-md">

                <div className="flex items-center justify-between mb-8">
                    {/* 뒤로 가기 버튼 */}
                    <button
                        onClick={() => navigate(-1)}
                        className="px-3 py-1 text-white px-3 hover:text-green-400 hover:bg-gray-200 hover:rounded transition">
                            &lt;
                    </button>

                    <h1 className="text-center text-4xl font-bold flex-1">로그인</h1>
                </div>
                
                {/* 구글 로그인 */}
                <button className="w-full border border-gray-400 rounded p-2 flex items-center justify-center mb-4 hover:bg-gray-200 hover:text-gray-700">
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google" 
                        className="w-5 h-5"    
                    />
                    구글 계정으로 로그인
                </button>

                <div className="flex items-center mb-4">
                    <div className="flex-1 h-px bg-gray-500"></div>
                    <span className="px-2 text-gray-400">OR</span>
                    <div className="flex-1 h-px bg-gray-500"></div>
                </div>

                {/* 이메일/비번 입력 */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 이메일 */}
                    <div>
                        <input
                            name="email"
                            type="email"
                            placeholder="이메일 입력"
                            value={values.email}
                            onChange={handleChange}
                            className="w-full p-2 rounded border-gray-300"
                        />
                        {touched.email && errors.email && (
                            <p className="text-red-400 text-sm">{errors.email}</p>
                        )}
                    </div>
                    
                    {/* 비번 */}
                    <div>
                        <input
                            name="password"
                            type="password"
                            placeholder="비밀번호 입력"
                            value={values.password}
                            onChange={handleChange}
                            className="w-full p-2 rounded border-gray-300"
                    />
                    { touched.password && errors.password && (
                        <p className="text-red-400 text-sm">{errors.password}</p>
                    )}
                    </div>

                    {/* 로그인 버튼 */}
                    <button
                        type="submit"
                        disabled={!isValid}
                        className={`w-full p-2 rounded ${
                            isValid ? "bg-green-600 hover:bg-green700" : "bg-gray-300"
                        }`}
                    >
                        로그인
                    </button>
                </form>
            </div>
        </div>
    )
}