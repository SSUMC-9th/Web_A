import { useState } from 'react';

interface FormState {
  [key: string]: string;
}

interface FormErrors {
  [key: string]: string;
}

interface FormValidationRules {
  [key: string]: (value: string) => string | null;
}

export const useForm = (
  initialValues: FormState,
  validationRules: FormValidationRules = {}
) => {
  const [values, setValues] = useState<FormState>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // 값 변경 핸들러
  const handleChange = (name: string, value: string) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    // 실시간 유효성 검사
    if (validationRules[name] && touched[name]) {
      const error = validationRules[name](value);
      setErrors(prev => ({
        ...prev,
        [name]: error || ''
      }));
    }
  };

  // 블러 핸들러 (포커스 해제)
  const handleBlur = (name: string) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // 블러 시 유효성 검사
    if (validationRules[name]) {
      const error = validationRules[name](values[name]);
      setErrors(prev => ({
        ...prev,
        [name]: error || ''
      }));
    }
  };

  // 전체 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const error = validationRules[field](values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // 폼이 유효한지 확인
  const isFormValid = (): boolean => {
    return Object.keys(validationRules).every(field => {
      const error = validationRules[field](values[field]);
      return !error;
    });
  };

  // 폼 리셋
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    isFormValid,
    resetForm
  };
};
