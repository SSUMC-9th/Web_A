import axiosInstance from "./axios";
import type {
  RequestSignInDto,
  RequestSignUpDto,
  ResponseSignUpDto,
  ResponseSignInDto,
  ResponseMyInfoDto,
  RequestUpdateProfileDto,
  ResponseUpdateProfileDto,
} from "../src/types/common";

export const postSignup = async (
  body: RequestSignUpDto
): Promise<ResponseSignUpDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signup", body);
  return data;
};

export const postSignin = async (
  body: RequestSignInDto
): Promise<ResponseSignInDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signin", body);
  return data;
};

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.get("/v1/users/me");

  return data;
};

export const postLogout = async () => {
  const { data } = await axiosInstance.post("/v1/auth/signout");
};

export const updateProfile = async (
  body: RequestUpdateProfileDto
): Promise<ResponseUpdateProfileDto> => {
  const { data } = await axiosInstance.patch("/v1/users", body);
  return data;
};