import type { PaginationDto } from "../types/common.ts";
import axiosInstance from "./axios.ts";

export const getLpList = async (paginationDto: PaginationDto) => {
    const { data } = await axiosInstance.get("/v1/lps", {
        params: paginationDto,
    });

    return data;
};

export const getLpDetail = async (lpid: string) => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpid}`);
    return data;
};
