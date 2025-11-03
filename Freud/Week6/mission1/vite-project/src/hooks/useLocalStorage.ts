import { useState, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
    // localStorage에서 값을 읽는 함수
    const readValue = useCallback(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`localStorage에서 키 "${key}"를 읽는 중 오류 발생:`, error);
            return initialValue;
        }
    }, [key, initialValue]);

    // 상태 초기화
    const [storedValue, setStoredValue] = useState<T>(readValue);

    // 값을 설정하는 함수
    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            // 함수 타입인지 확인하고 처리
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            // 상태 업데이트
            setStoredValue(valueToStore);

            // localStorage에 저장
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.warn(`localStorage에 키 "${key}"를 저장하는 중 오류 발생:`, error);
        }
    }, [key, storedValue]);

    // 값을 제거하는 함수
    const removeValue = useCallback(() => {
        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.warn(`localStorage에서 키 "${key}"를 제거하는 중 오류 발생:`, error);
        }
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue] as const;
}
