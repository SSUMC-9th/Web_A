import axios from "axios";
import { api } from "./axios";

// 내 정보 수정
export const patchMe = async (body: {
    name?: string;
    bio?: string | null;
    avatarFile?: File | null;
}) => {
    const fd = new FormData();
    if (body.name != null) fd.append("name", body.name);
    if (body.bio !== undefined) fd.append("bio", body.bio ?? "");
    if (body.avatarFile !== undefined) {
        if (body.avatarFile) fd.append("avatar", body.avatarFile);
        else fd.append("avatar", "");
    }

    try {
        const { data } = await api.patch("/v1/users/me", fd, {
            withAuth: true,
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    }
    catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
            const { data } = await api.put("/v1/users/me", fd, {
                withAuth: true,
                headers: { "Content-Type": "multipart/form-data" },
            });
            return data;
        }
        throw err;
    }
};

// 회원 탈퇴
export const deleteMe = async () => {
    const {data} = await api.delete("/v1/users/me", {withAuth: true});
    return data;
}