import React from "react";
import { Link } from "react-router-dom";

const PremiumRequiredPage = () => {
  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* 아이콘 */}
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl">🔒</span>
          </div>

          {/* 제목 */}
          <h2 className="text-2xl font-bold text-gray-900">프리미엄 회원 전용</h2>

          {/* 설명 */}
          <p className="text-gray-600">
            이 콘텐츠는 프리미엄 회원만 이용할 수 있습니다.
            <br />
            프리미엄으로 업그레이드하고 독점 콘텐츠를 즐겨보세요!
          </p>

          {/* 버튼들 */}
          <div className="space-y-3">
            <Link
              to="/mypage"
              className="block w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-medium shadow-lg"
            >
              마이페이지에서 업그레이드하기
            </Link>
            <Link
              to="/"
              className="block w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumRequiredPage;