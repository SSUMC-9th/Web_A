// useThrottle : 주어진 값(상태)가 자주 변경될 때
// 최소 interval(밀리초) 간격으로만 업데이트 해서 성능을 개선한다.
// 이 커스텀 훅으로 scroll과정 등을 감싸면, 쓰로틀링 활용 가능.!
import { useEffect, useRef, useState } from "react";

function useThrottle<T>(value: T, delay: number = 500): T {
  // 1. 상태 변수 : throttledValue : 최종적으로 쓰로틀링 적용된 값.
  // 초기값을 전달받은 value
  const [throttledValue, setThrottledValue] = useState<T>(value);

  // 2. Ref lastExecuted : 마지막으로 실행된 시간을 기록하는 변수
  // useRef 사용하면 컴포넌트가 리렌더링 되어도 값이 유지되고, 변경되어도 리렌더링을 트리거하지않아요.
  const lastExecuted: React.RefObject<number> = useRef<number>(Date.now());

  // 3. useEffect: value, delay가 변경될때 아래 로직 실행.
  useEffect(() => {
    // 현재 시간과 lastExecuted.current에 저장된 마지막 시각 + delay를 비교합니다.
    // 충분한 시간이 지나면 바로업데이트
    if (Date.now() >= lastExecuted.current + delay) {
      // 현재 시간이 지난 경우,
      // 현재 시각으로 lastExecuted 업데이트
      lastExecuted.current = Date.now();
      // 최신 value를 throttledValue에 저장해서 컴포넌트 리렌더링
      setThrottledValue(value);
    } else {
      // 충분한 시간이 지나지 않은 경우, delay 시간 후에 업데이트 (최신 value를)
      const timerID = setTimeout(() => {
        //타이머가 만료된다면, 최근 업데이트 시간을 현재 시각으로.
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, delay);
      return () => clearTimeout(timerID);
    }
  }, [value, delay]);

  return throttledValue;
}

export default useThrottle;
