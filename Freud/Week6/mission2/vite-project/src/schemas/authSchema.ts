import { z } from 'zod';

// 로그인 폼 스키마
export const loginFormSchema = z.object({
    email: z
        .string()
        .min(1, '이메일을 입력해주세요.')
        .email('올바른 이메일 형식을 입력해주세요.'),
    password: z
        .string()
        .min(1, '비밀번호를 입력해주세요.')
        .min(6, '비밀번호는 6자 이상이어야 합니다.'),
});

// 회원가입 1단계 스키마 (이메일)
export const signupEmailSchema = z.object({
    email: z
        .string()
        .min(1, '이메일을 입력해주세요.')
        .email('올바른 이메일 형식을 입력해주세요.'),
});

// 회원가입 2단계 스키마 (비밀번호)
export const signupPasswordSchema = z.object({
    password: z
        .string()
        .min(1, '비밀번호를 입력해주세요.')
        .min(6, '비밀번호는 6자 이상이어야 합니다.'),
    passwordConfirm: z
        .string()
        .min(1, '비밀번호 확인을 입력해주세요.'),
}).refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
});

// 회원가입 3단계 스키마 (닉네임)
export const signupNicknameSchema = z.object({
    nickname: z
        .string()
        .min(1, '닉네임을 입력해주세요.')
        .min(2, '닉네임은 2자 이상이어야 합니다.')
        .max(20, '닉네임은 20자 이하여야 합니다.'),
});

// 전체 회원가입 스키마
export const signupFullSchema = z.object({
    email: z
        .string()
        .min(1, '이메일을 입력해주세요.')
        .email('올바른 이메일 형식을 입력해주세요.'),
    password: z
        .string()
        .min(1, '비밀번호를 입력해주세요.')
        .min(6, '비밀번호는 6자 이상이어야 합니다.'),
    passwordConfirm: z
        .string()
        .min(1, '비밀번호 확인을 입력해주세요.'),
    nickname: z
        .string()
        .min(1, '닉네임을 입력해주세요.')
        .min(2, '닉네임은 2자 이상이어야 합니다.')
        .max(20, '닉네임은 20자 이하여야 합니다.'),
}).refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
});

// 타입 정의
export type LoginFormType = z.infer<typeof loginFormSchema>;
export type SignupEmailType = z.infer<typeof signupEmailSchema>;
export type SignupPasswordType = z.infer<typeof signupPasswordSchema>;
export type SignupNicknameType = z.infer<typeof signupNicknameSchema>;
export type SignupFullType = z.infer<typeof signupFullSchema>;