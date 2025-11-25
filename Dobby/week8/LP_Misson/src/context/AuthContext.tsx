import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Context,
  type PropsWithChildren,
} from "react";
import { getMyInfo, postLogout, postSignin } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { type RequestSigninDto } from "../types/auth";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  userName: string | null;
  login: (signinData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext: Context<AuthContextType> = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  userName: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN);

  const [accessToken, setAccessToken] = useState<string | null>(getAccessTokenFromStorage());
  const [refreshToken, setRefreshToken] = useState<string | null>(getRefreshTokenFromStorage());
  const [userName, setUserName] = useState<string | null>(null);

  // accessToken이 존재하면 내 정보를 불러와 사용자명을 세팅한다
  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        if (!accessToken) return;
        const { data } = await getMyInfo();
        if (data?.name) {
          setUserName(data.name);
        }
      } catch (e) {
        console.error("내 정보 조회 실패", e);
      }
    };
    fetchMyInfo();
  }, [accessToken]);

  const login = async (signinData: RequestSigninDto) => {
    try {
      const { data } = await postSignin(signinData);

      if (data) {
        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        setAccessTokenInStorage(newAccessToken);
        setRefreshTokenInStorage(newRefreshToken);

        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        if (data.name) {
          setUserName(data.name);
        }
        alert("로그인에 성공했습니다.");
        // 로그인 전 저장된 리디렉션 경로가 있으면 우선 이동
        try {
          const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY.REDIRECT_PATH);
          const redirectTo = raw ? JSON.parse(raw) : null;
          if (redirectTo) {
            window.localStorage.removeItem(LOCAL_STORAGE_KEY.REDIRECT_PATH);
            window.location.href = redirectTo as string;
          } else {
            window.location.href = "/mypage";
          }
        } catch {
          window.location.href = "/mypage";
        }
      }
    } catch (error) {
      console.error("로그인 오류", error);
      alert("로그인에 실패했습니다.");
    }
  };

  const logout = async () => {
    try {
      await postLogout();
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();

      setAccessToken(null);
      setRefreshToken(null);
      setUserName(null);

      alert("로그아웃에 성공했습니다.");
    } catch (error) {
      console.error("로그아웃 오류", error);
      alert("로그아웃에 실패했습니다.");
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext를 찾을 수 없습니다");
  }

  return context;
};
