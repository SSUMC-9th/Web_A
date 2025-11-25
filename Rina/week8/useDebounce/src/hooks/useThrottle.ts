import { useEffect, useRef, useState } from "react";

export default function useThrottle<T>(value: T, interval: number) {
    const [throttledValue, setThrottledValue] = useState(value);
    const lastTimeRef = useRef<number>(0);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const now = Date.now();
        const remaining = interval - (now - lastTimeRef.current);

        if (remaining <= 0) {
            // 바로 갱신 가능
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
                timeoutRef.current= null;
            }
            setThrottledValue(value);
            lastTimeRef.current = now;
        }
        else {
            // 남은 시간 뒤에 한 번 더 반영
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = window.setTimeout(() => {
                setThrottledValue(value);
                lastTimeRef.current = Date.now();
                timeoutRef.current = null;
            }, remaining);
        }

        // 의존성 변경/언마운트 시 타이머 정리
        return () => {
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [value, interval]);

    return throttledValue;
}