export type UserSigninInformation = {
  email: string;
  password: string;
};

function validateUser(user: UserSigninInformation) {
  const errors: Partial<Record<keyof UserSigninInformation, string>> = {};

  // 이메일 검증
  if (!user.email) {
    errors.email = 'Email is required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(user.email)) {
    errors.email = 'Invalid email address';
  }

  // 비밀번호 검증 (8~20자)
  if (!user.password) {
    errors.password = 'Password is required';
  } else if (user.password.length < 8 || user.password.length > 20) {
    errors.password = 'Password must be between 8 and 20 characters';
  }

  return errors;
}

export function validateUserSignin(user: UserSigninInformation) {
  return validateUser(user);
}

// Signup용 검증 함수 (필요시 사용)
export type UserSignupInformation = UserSigninInformation & {
  confirmPassword: string;
};

export function validateUserSignup(user: UserSignupInformation) {
  const errors = validateUser(user) as Partial<Record<keyof UserSignupInformation, string>>;
  
  if (!user.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (user.password !== user.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return errors;
}