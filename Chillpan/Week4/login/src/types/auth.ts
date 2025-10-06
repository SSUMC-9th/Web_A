import type { CommonResponse } from "./common";

export type RequestSignUpDto = {
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  password: string;
};

export type ResponseSignUpDto = CommonResponse<{
  user: {
    id: string;
    name: string;
    email: string;
  };
}>;
