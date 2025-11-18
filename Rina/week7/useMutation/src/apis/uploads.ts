import { api } from "./axios";

export const uploadImage = async (file: File, isPublic = false) => {
    const fd = new FormData();
    fd.append("file", file);

    const path = isPublic ? "/v1/uploads/public" : "/v1/uploads";
    const { data } = await api.post(path, fd, {
        withAuth: !isPublic,        // public이면 인증 안 함
        headers: {"Content-Type" : "multipart/form-data"},
    });

    return data?.data?.imageUrl as string;
}