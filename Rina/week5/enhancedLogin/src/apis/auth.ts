import { api } from "./axios";

import {
    type RequestSignupDto,
    type ResponseSignupDto,
    type RequestSigninDto,
    type ResponseSigninDto,
} from "../types/auth";

export const postSignup = async (body: RequestSignupDto) => {
    const {data} = await api.post<ResponseSignupDto>("/v1/auth/signup", body);
    return data;
};

export const postSignin = async (body: RequestSigninDto) => {
    const {data} = await api.post<ResponseSigninDto>("/v1/auth/signin", body);
    return data;
};

export const getMyInfo = async () => {
    const {data} = await api.get("/v1/users/me");
    return data;
}

export const postLogout = async () => {
    const {data} = await api.post('/v1/auth/signout')
    return data;
}