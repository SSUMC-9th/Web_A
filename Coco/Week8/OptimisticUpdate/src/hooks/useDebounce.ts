import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 타이머 설정: delay 후에 값 업데이트
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 클린업 함수: 컴포넌트 언마운트 또는 의존성 변경 시 타이머 정리
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // value나 delay가 변경될 때마다 effect 재실행

  return debouncedValue;
}