import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // value나 delay가 다시 바뀌면 이전 타이머 제거
        return () => {
            clearTimeout(timerId);
        };
        // delay 변경시 즉시 반영
    }, [value, delay]);

    return debouncedValue;
}