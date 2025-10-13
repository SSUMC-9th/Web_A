import { useEffect, useState } from "react";

interface UseFormProps<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => void;
}

export function useForm<T>({ initialValues, validate, onSubmit }: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  // 사용자가 입력을 바꿀때 실행되는 함수
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues, // 기존값 유지
      [name]: value, // 변경된 값만 업데이트
    }));
  };

  // 사용자가 입력필드를 벗어날때 실행되는 함수
  const handleBlur = (fieldName: keyof T) => {
    setTouched((prevTouched) => ({
      ...prevTouched,
      [fieldName]: true,
    }));
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
    }
  };

  const getInputProps = (fieldName: keyof T) => ({
    name: fieldName as string,
    value: (values[fieldName] as string) || '',
    onChange: handleChange,
    onBlur: () => handleBlur(fieldName),
  });

  // 에러검증 로직
  useEffect(() => {
    const validationErrors = validate ? validate(values) : {};
    setErrors(validationErrors);
  }, [values, validate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 모든 필드를 touched로 설정
    const allTouched = Object.keys(values as object).reduce((acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    }, {} as Partial<Record<keyof T, boolean>>);
    setTouched(allTouched);

    const validationErrors = validate ? validate(values) : {};
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(values);
    }
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    getInputProps,
  };
}