import { useEffect, useRef, useState } from "react";

function useThrottle<T>(value: T, delay: number = 500) {
    // 1. 상태 변수 : throttleValue : 최종적으로 스로틀링 적용된 값 저장하는 변수
    // 초기값을 전달받은 value
    const [throttleValue, setThrottleValue] = useState<T>(value);

    // 2.Ref lastExecuted : 마지막으로 실행된 시간을 기록하는 변수
    // useRef 사용하면 컴포넌트가 리렌더링 되어도 값이 유지되고, 변경되어도 리렌더링을 트리거하지 않음
    const lastExecuted = useRef<number>(Date.now());

    // 3. useEffect : value, delay가 변경될 때 마다 아래 로직 수행
    useEffect(() => {
        //현재 시각과 lastExecuted.current에 저장된 마지막 시각 + delay를 비교
        //충분한 시간이 지나면 현재 시각을 lastExecuted.current에 저장하고, value를 throttleValue에 업데이트
        if (Date.now() >= lastExecuted.current + delay) {
            //현재 시간이 지난경우
            // 현재 시각으로 lastExecuted.current를 업데이트
            lastExecuted.current = Date.now();
            // 최신 value를 throttleValue에 업데이트해서 컴포넌트 리렌더링
            setThrottleValue(value);
        } else {
            // 충분한 시간이 지나지 않은 경우, delay 시간 후에 업데이트(최신 value로 함)
            const timerId = setTimeout(() => {
                // 타이머가 만료돠면, 마지막 업데이트 시간을 현재 시각으로 갱신하고, value를 throttleValue에 업데이트
                lastExecuted.current = Date.now();
                // 최신 value를 throttleValue에 업데이트해서 컴포넌트 리렌더링
                setThrottleValue(value);
            }, delay);

            //cleanup 함수: 이펙트가 재실행되기 전에 타이머가 실행되지 않았다면
            // 기존 타이머를 clearTimeout으로 취소하고, 새로운 타이머를 설정 -> 중복 업데이트 방지
            return () => clearTimeout(timerId);
        }
    }, [value, delay]);

    // 4. 최종적으로 반환되는 값은 throttleValue입니다. "스로틀링 적용된 값"
    return throttleValue;
}
export default useThrottle;