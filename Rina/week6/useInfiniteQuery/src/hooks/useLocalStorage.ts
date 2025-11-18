import { useState } from "react";

export function useLocalStorage<T> (key:string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item == null) return initialValue;

            try {
                return JSON.parse(item) as T;
            }
            catch {
                return item as unknown as T;
            }
        }
        catch {
            return initialValue;
        }
    });

    const setValue = (value : T) => {
        try {
            setStoredValue(value);
            if (typeof value === "string") {
                window.localStorage.setItem(key, value);
            }
            else {
                window.localStorage.setItem(key, JSON.stringify(value));
            }
        }
        catch (error) {
            console.error(error);
        };
    }
    return [storedValue, setValue] as const;
}