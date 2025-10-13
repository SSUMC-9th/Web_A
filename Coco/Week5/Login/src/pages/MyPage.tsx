import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";

const MyPage = () => {
  const { user, isPremium, upgradeToPremium } = useAuth();

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">👤 마이페이지</h1>
        
        {/* Protected Route 설명 */}
        <div className="bg-blue-50 border-2 border-blue-400 p-6 rounded-lg mb-6">
          <p className="text-blue-900 font-medium mb-2">🔒 Protected Route: 로그인 필수</p>
          <p className="text-blue-800 text-sm">이 페이지는 로그인한 사용자만 접근 가능합니다.</p>
          <p className="text-blue-700 text-sm mt-1">
            비로그인 상태에서 이 URL에 접근하면 자동으로 로그인 페이지로 리다이렉트됩니다.
          </p>
        </div>

        {/* 회원 정보 */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">회원 정보</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>이메일:</strong> {user?.email}</p>
              <p><strong>닉네임:</strong> {user?.nickname}</p>
              <p>
                <strong>등급:</strong>{' '}
                {isPremium ? (
                  <span className="text-purple-600 font-semibold">프리미엄 회원 ⭐</span>
                ) : (
                  <span className="text-gray-600">일반 회원</span>
                )}
              </p>
            </div>
          </div>

          {/* 프리미엄 업그레이드 */}
          {!isPremium ? (
            <div className="bg-purple-50 border-2 border-purple-400 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                ⭐ 프리미엄 업그레이드
              </h3>
              <p className="text-purple-800 mb-4">
                프리미엄 회원이 되면 독점 웹툰을 감상할 수 있습니다!
              </p>
              <button
                onClick={() => {
                  upgradeToPremium();
                  alert('프리미엄 업그레이드 완료! 이제 프리미엄 웹툰을 볼 수 있습니다 🎉');
                }}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-medium shadow-lg"
              >
                프리미엄 업그레이드하기
              </button>
            </div>
          ) : (
            <div className="bg-purple-100 p-6 rounded-lg text-center">
              <p className="text-2xl mb-2">🎉</p>
              <p className="text-purple-900 font-semibold">프리미엄 회원입니다!</p>
              <p className="text-purple-700 text-sm mt-2">
                이제 모든 프리미엄 콘텐츠를 이용할 수 있습니다.
              </p>
              <Link
                to="/premium/webtoon/1"
                className="inline-block mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                프리미엄 웹툰 보러가기
              </Link>
            </div>
          )}

          <Link
            to="/"
            className="block w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium text-center"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyPage;