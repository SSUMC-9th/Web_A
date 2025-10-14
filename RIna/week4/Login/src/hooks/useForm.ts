import React, { useState } from "react";

interface UseFormReturn<T> {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    touched: Partial<Record<keyof T, boolean>>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isValid: boolean;
}

export function useForm<T>(
    initialValues: T,
    validate: (values: T) => Partial<Record<keyof T, string>>
): UseFormReturn<T> {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
    // 입력한 이후 상태를 보기 위해 추가함
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));

        setTouched((prev) => ({
            ...prev,
            [name] : true,
        }));

        const newValues = {
            ...values,
            [name]: value,
        } as T;

        setErrors(validate(newValues));
    };

    const valuesObj = values as unknown as Record<string, unknown>;
    const isValid = Object.keys(errors).length === 0 &&
                    Object.values(valuesObj).every((v) => v !== "");
    return {
        values,
        errors,
        touched,
        handleChange,
        isValid,
    };
}