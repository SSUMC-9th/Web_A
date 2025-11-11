import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLogout } from '../../hooks/useAuthMutations';

export const Header = () => {
  const { user, isAuthenticated } = useAuth();
  const { mutate: logout, isPending } = useLogout();

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        LP Gallery
      </Link>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            {/* 닉네임이 실시간으로 업데이트됩니다 */}
            <span className="text-gray-700">
              {user?.nickname}님 반갑습니다.
            </span>
            <button
              onClick={() => logout()}
              disabled={isPending}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              {isPending ? '로그아웃 중...' : '로그아웃'}
            </button>
          </>
        ) : (
          <div className="flex gap-2">
            <Link
              to="/login"
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              회원가입
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};