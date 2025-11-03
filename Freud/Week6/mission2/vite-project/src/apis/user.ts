import axiosInstance from "./axios.ts";

export const getUserInfo = async () => {
    const { data } = await axiosInstance.get("/v1/users/me");
    return data;
};
