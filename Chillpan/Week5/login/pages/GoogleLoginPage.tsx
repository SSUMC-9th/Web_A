import { useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.tsx";
import { LOCAL_STORAGE_KEY } from "../constants/key.ts";

const GoogleLoginPage = () => {
  const { setItem: setAccessToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.accessToken
  );
  const { setItem: setRefreshToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.refreshToken
  );

  useEffect(() => {
    const urlParams: URLSearchParams = new URLSearchParams(
      window.location.search
    );
    const accessToken: string | null = urlParams.get(
      LOCAL_STORAGE_KEY.accessToken
    );
    const refreshToken: string | null = urlParams.get(
      LOCAL_STORAGE_KEY.refreshToken
    );

    if (accessToken) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      window.location.href = "/mypage";
    }
  }, [setAccessToken, setRefreshToken]);

  return <div>당신은 구글 로그인으로 로그인 하셨습니다.</div>;
};

export default GoogleLoginPage;
