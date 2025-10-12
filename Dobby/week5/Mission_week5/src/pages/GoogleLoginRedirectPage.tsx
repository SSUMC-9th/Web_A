import { useEffect } from "react";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

const GoogleLoginRedirectPage = () => {
    const { setItem : setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    const { setItem : setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
        const refreshToken = urlParams.get(LOCAL_STORAGE_KEY.REFRESH_TOKEN);

        if (accessToken) {
            setAccessToken(accessToken);
            setRefreshToken(refreshToken || "");
            window.location.href = "/mypage";
        }
    }, [setAccessToken, setRefreshToken]);

    return (
        <div>

        </div>
    );
};

export default GoogleLoginRedirectPage;