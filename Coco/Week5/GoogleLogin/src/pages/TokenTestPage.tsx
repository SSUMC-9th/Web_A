import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import React from 'react';

const TokenTestPage = () => {
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // 보호된 API 호출 테스트
  const testProtectedAPI = async () => {
    setLoading(true);
    setResponse('');
    
    try {
      const res = await axiosInstance.get('/user/me');
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (error: any) {
      setResponse(`에러 발생: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 토큰 정보 확인
  const checkTokens = () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    setResponse(`
Access Token: ${accessToken ? '존재' : '없음'}
${accessToken ? `토큰: ${accessToken.substring(0, 50)}...` : ''}

Refresh Token: ${refreshToken ? '존재' : '없음'}
${refreshToken ? `토큰: ${refreshToken.substring(0, 50)}...` : ''}
    `);
  };

  // Access Token 강제 만료 (테스트용)
  const expireAccessToken = () => {
    localStorage.setItem('accessToken', 'expired_token');
    setResponse('Access Token을 만료된 토큰으로 교체했습니다.\n"보호된 API 호출" 버튼을 눌러 자동 갱신을 테스트하세요.');
  };

  // 토큰 삭제
  const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setResponse('모든 토큰이 삭제되었습니다.');
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          🔑 Refresh Token 테스트 페이지
        </h1>

        {/* 설명 */}
        <div className="bg-blue-50 border-2 border-blue-400 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">테스트 방법</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
            <li>먼저 로그인하여 토큰을 받아옵니다.</li>
            <li>"토큰 정보 확인" 버튼으로 토큰이 저장되었는지 확인합니다.</li>
            <li>"보호된 API 호출" 버튼으로 정상 작동을 확인합니다.</li>
            <li>"Access Token 강제 만료" 버튼으로 토큰을 만료시킵니다.</li>
            <li>다시 "보호된 API 호출"을 누르면 자동으로 토큰이 갱신됩니다!</li>
          </ol>
        </div>

        {/* 버튼들 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={testProtectedAPI}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-300"
          >
            {loading ? '요청 중...' : '보호된 API 호출'}
          </button>

          <button
            onClick={checkTokens}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
          >
            토큰 정보 확인
          </button>

          <button
            onClick={expireAccessToken}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition font-medium"
          >
            Access Token 강제 만료
          </button>

          <button
            onClick={clearTokens}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-medium"
          >
            토큰 삭제
          </button>
        </div>

        {/* 응답 결과 */}
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg">
          <h3 className="text-sm font-semibold mb-2 text-gray-300">응답 결과:</h3>
          <pre className="text-xs whitespace-pre-wrap overflow-x-auto">
            {response || '버튼을 클릭하여 테스트를 시작하세요.'}
          </pre>
        </div>

        {/* 토큰 갱신 흐름 설명 */}
        <div className="mt-6 bg-purple-50 border-2 border-purple-400 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-purple-900 mb-2">
            🔄 자동 토큰 갱신 흐름
          </h2>
          <div className="space-y-2 text-purple-800 text-sm">
            <p><strong>1단계:</strong> API 요청 시 Access Token을 헤더에 자동 추가</p>
            <p><strong>2단계:</strong> 서버가 401 응답 (토큰 만료)</p>
            <p><strong>3단계:</strong> Refresh Token으로 새 Access Token 요청</p>
            <p><strong>4단계:</strong> 새 토큰 저장 후 원래 요청 재시도</p>
            <p><strong>5단계:</strong> 성공! 사용자는 아무것도 모름 😎</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenTestPage;