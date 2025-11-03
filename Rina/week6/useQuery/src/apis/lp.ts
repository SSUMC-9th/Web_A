import { api } from "./axios";
import type {Lp, Paginated } from '../types/lp';

export type LpSort = "latest" | "oldest";

export async function getLPs(sort: LpSort = 'latest') {
    const { data } = await api.get('/v1/lps', {params: { sort }})
    
    // 응답이 배열일 때
    if (Array.isArray(data)) {
        return {data, total: data.length} as Paginated<Lp>;
    }

    // data.data가 배열이면 그대로 반환
    if (Array.isArray(data.data)) {
        return data as Paginated<Lp>;
    }

    // 예외; 다른 키
    if (Array.isArray(data.lps)) {
        return {data: data.lps, total: data.lps.length} as Paginated<Lp>;
    }

    throw new Error("/v1/lps에서 Unexpected response format")
};

export async function getLP(lpid: string|number) {
    const {data} = await api.get<{data: Lp}>(`/v1/lps/${lpid}`);
    return data.data;
}