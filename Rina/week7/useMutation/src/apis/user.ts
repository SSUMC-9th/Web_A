import { api } from "./axios";
import { uploadImage } from "./uploads";

// 내 정보 수정
export const patchMe = async (body: {
    name?: string;
    bio?: string | null;
    avatarFile?: File | null;
}) => {
    // 1) 파일이 있으면 먼저 업로드해서 URL 획득
    let avatarUrl: string | undefined;
    if (body.avatarFile) {
        // 서버가 인증 기반 업로드면 false 유지 (withAuth: true 로 보내는 버전)
        avatarUrl = await uploadImage(body.avatarFile, false);
    }

    // 2) 서버는 json으로 patch /v1/users를 받음
    const payload: Record<string, unknown> = {};
    if (body.name !== undefined) payload.name = body.name;
    if (body.bio !== undefined) payload.bio = body.bio;
    if (avatarUrl !== undefined) payload.avatar = avatarUrl;

    const { data } = await api.patch("/v1/users", payload, {
        withAuth: true,
        headers: { "Content-Type": "application/json" },
    });
    return data;
};

// 회원 탈퇴
export const deleteMe = async () => {
    const {data} = await api.delete("/v1/users", {withAuth: true});
    return data;
}