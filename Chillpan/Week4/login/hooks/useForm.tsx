import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";

interface UseFormProps<T> {
  initialValue: T; // 예: { email: '', password: '' }
  // 값이 올바른지 검증하는 함수.
  validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({ initialValue, validate }: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValue);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  //사용자가 입력한 값을 업데이트 해주는 함수
  const handleChange = (name: keyof T, text: string) => {
    setValues({
      ...values,
      [name]: text,
    });
  };

  const handleBlur = (name: keyof T) => {
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  // 이메일 인풋, 패스워드 인풋, 속성들을 좀 가져오는것
  const getInputProps = (name: keyof T) => {
    const value: T[keyof T] = values[name];

    const onChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      handleChange(name, e.target.value);
    };

    const onBlur = () => handleBlur(name);

    return { value, onChange, onBlur };
  };

  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors);
  }, [validate, values]);

  return { values, errors, touched, getInputProps };
}

export default useForm;
