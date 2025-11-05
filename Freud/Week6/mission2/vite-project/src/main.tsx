import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // statleTime을 3초로 바꾸고 테스트해보기. 재요청이 되는지?
      // staleTime: 1, // 10분 -> 1초 바꿔보기,  데이터가 k초 후 stale 상태로 전환)
      staleTime: 1000 * 60 * 5, // 10분 -> 1초 바꿔보기,  데이터가 k초 후 stale 상태로 전환)
      // gcTime: 2, //10분 -> 2초바꿔보기.
      gcTime: 1000 * 60 * 10, //10분 -> 2초바꿔보기.
      refetchOnWindowFocus: false, // 탭 전환 시 자동 재요청 방지
      retry: 1, // 실패 시 1번만 재시도
    },
  },
});

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
  // </StrictMode>,
)
