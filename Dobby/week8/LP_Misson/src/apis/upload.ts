import type { CommonResponse } from "../types/common";
import { axiosInstance } from "./axios";

export type UploadImageResponse = CommonResponse<{
  imageUrl: string;
}>;

// 인증 필요 없으면 isPublic=true로 호출 (/v1/uploads/public)
export const postUploadImage = async (
  file: File,
  isPublic: boolean = true
): Promise<UploadImageResponse> => {
  const form = new FormData();
  form.append("file", file);

  const url = isPublic ? "/v1/uploads/public" : "/v1/uploads";
  const { data } = await axiosInstance.post(url, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
