import type { PaginationDto } from "../src/types/common.ts";
import axiosInstance from "./axios.ts";
import type { ResponseLpListDto } from "../src/types/lp.ts";

export const getLpList = async (
  paginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto,
  });

  return data;
};
