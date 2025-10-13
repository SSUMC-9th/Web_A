import React from "react";
import { Link } from "react-router-dom";

const FreeWebtoonPage = () => {
  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">🆓 무료 웹툰 #1</h1>
        
        {/* 설명 박스 */}
        <div className="bg-green-100 border-2 border-green-400 p-4 rounded-lg mb-6">
          <p className="text-green-800 font-medium">
            ✅ 인증 없이 누구나 볼 수 있는 무료 콘텐츠입니다
          </p>
          <p className="text-green-700 text-sm mt-1">
            이 페이지는 로그인하지 않아도 접근할 수 있습니다.
          </p>
        </div>

        {/* 웹툰 콘텐츠 영역 */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-green-100 to-blue-100 h-96 rounded-lg flex items-center justify-center border-2 border-green-300">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-700 mb-2">무료 웹툰 콘텐츠</p>
              <p className="text-gray-600">Protected Route가 필요하지 않은 공개 페이지</p>
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

export default FreeWebtoonPage;