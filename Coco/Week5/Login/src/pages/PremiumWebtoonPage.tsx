import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";

const PremiumWebtoonPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-3xl font-bold text-gray-900">⭐ 프리미엄 웹툰 #1</h1>
          <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
            PREMIUM ONLY
          </span>
        </div>

        {/* 설명 박스 */}
        <div className="bg-purple-100 border-2 border-purple-400 p-4 rounded-lg mb-6">
          <p className="text-purple-900 font-medium">
            🔒 Protected Route: 프리미엄 회원 전용
          </p>
          <p className="text-purple-800 text-sm mt-1">
            이 페이지는 로그인 + 프리미엄 등급이 필요합니다.
          </p>
          <p className="text-purple-700 text-sm mt-1">
            조건을 만족하지 않으면 업그레이드 안내 페이지로 리다이렉트됩니다.
          </p>
        </div>

        {/* 웹툰 콘텐츠 */}
        <div className="space-y-4">
          <p className="text-gray-700 text-lg">
            {user?.nickname}님, 프리미엄 웹툰을 즐겨주셔서 감사합니다! 🎉
          </p>
          
          <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200 h-96 rounded-lg flex items-center justify-center border-4 border-purple-300">
            <div className="text-center p-6">
              <p className="text-4xl mb-4">⭐✨⭐</p>
              <p className="text-2xl font-bold text-purple-900 mb-2">독점 프리미엄 웹툰</p>
              <p className="text-purple-700">프리미엄 회원만 볼 수 있는 특별한 콘텐츠입니다</p>
            </div>
          </div>

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

export default PremiumWebtoonPage;