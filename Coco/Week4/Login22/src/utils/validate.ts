export type UserSigninInformation = {
  email: string;
  password: string;
};

export type UserSignupInformation = {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
};

// 이메일만 검증
export function validateEmail(email: string) {
  const errors: { email?: string } = {};
  
  if (!email) {
    errors.email = '이메일을 입력해주세요.';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    errors.email = '올바른 이메일 형식을 입력해주세요.';
  }
  
  return errors;
}

// 비밀번호 검증
export function validatePassword(password: string, confirmPassword: string) {
  const errors: { password?: string; confirmPassword?: string } = {};
  
  if (!password) {
    errors.password = '비밀번호를 입력해주세요.';
  } else if (password.length < 6) {
    errors.password = '비밀번호는 6자 이상이어야 합니다.';
  } else if (password.length > 20) {
    errors.password = '비밀번호는 20자 이하여야 합니다.';
  }
  
  if (!confirmPassword) {
    errors.confirmPassword = '비밀번호를 다시 입력해주세요.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
  }
  
  return errors;
}

// 닉네임 검증
export function validateNickname(nickname: string) {
  const errors: { nickname?: string } = {};
  
  if (!nickname) {
    errors.nickname = '닉네임을 입력해주세요.';
  } else if (nickname.length < 2) {
    errors.nickname = '닉네임은 2자 이상이어야 합니다.';
  } else if (nickname.length > 10) {
    errors.nickname = '닉네임은 10자 이하여야 합니다.';
  }
  
  return errors;
}

// 로그인 검증
function validateUser(user: UserSigninInformation) {
  const errors: Partial<Record<keyof UserSigninInformation, string>> = {};

  if (!user.email) {
    errors.email = '이메일을 입력해주세요.';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(user.email)) {
    errors.email = '올바른 이메일 형식을 입력해주세요.';
  }

  if (!user.password) {
    errors.password = '비밀번호를 입력해주세요.';
  } else if (user.password.length < 6 || user.password.length > 20) {
    errors.password = '비밀번호는 6자 이상 20자 이하여야 합니다.';
  }

  return errors;
}

export function validateUserSignin(user: UserSigninInformation) {
  return validateUser(user);
}
