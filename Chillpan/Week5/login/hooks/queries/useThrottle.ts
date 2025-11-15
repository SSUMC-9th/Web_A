// 최소 interval(밀리초) 간격으로만 업데이트 해서 성능을 개선한다. -> 자주 업뎃되는 얘한테 쓰자.
// 이 커스텀 훅으로 scroll과정 등을 감싸면, 쓰로틀링 활용 가능.!
import { useEffect, useRef, useState } from "react";

function useThrottle<T>(value: T, delay: number): T {
  // 1. 상태 변수 : throttledValue : 최종적으로 쓰로틀링 적용된 값.
  // 초기값을 전달받은 value
  const [throttledValue, setThrottledValue] = useState<T>(value);

  // 2. lastExecuted : 마지막으로 실행된 시간을 기록하는 변수
  // useRef 사용하면 컴포넌트가 리렌더링 되어도 값이 유지되고, 변경되어도 리렌더링을 트리거하지않아요.
  const lastExecuted: React.RefObject<number> = useRef<number>(Date.now());

  // 3. useEffect: value, delay가 변경될때 아래 로직 실행.
  useEffect(() => {
    // 현재 시간이 지난번 수행 시간 + delay 보다 크면, 바로 업데이트
    if (Date.now() >= lastExecuted.current + delay) {
      lastExecuted.current = Date.now();
      // 최신 value를 throttledValue에 저장해서 컴포넌트 리렌더링
      setThrottledValue(value);
    } else {
      // 충분한 시간이 지나지 않은 경우, delay 시간 후에 업데이트 실행
      const timerID = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, delay);
      //클린업 시행 시점: 다음 effect가 실행되기 직전: 즉, value나 delay가 다시 바뀌어 useEffect가 재평가되기 전에
      return () => clearTimeout(timerID);
    }
  }, [value, delay]);

  return throttledValue;
}

export default useThrottle;
