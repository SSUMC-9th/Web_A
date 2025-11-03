import type { PaginationDto } from "../types/common.ts";
import axiosInstance from "./axios.ts";

export const getCommentList = async (lpId: string, paginationDto: PaginationDto) => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
        params: paginationDto,
    });
    return data;
};
