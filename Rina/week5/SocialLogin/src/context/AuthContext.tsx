import { createContext, useContext, useEffect, type PropsWithChildren } from "react";
import type { RequestSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/auth";

interface AuthContextType {
    accessToken : string | null;
    refreshToken : string | null;
    login: (signInData: RequestSigninDto) => Promise<void>;
    logout: () => Promise<void>;
    isLoggedIn: boolean;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken:null,
    login:async() => {},
    logout: async() => {},
    isLoggedIn: false,
});

export const AuthProvider = ({children}:PropsWithChildren) => {
    const [accessToken, setAccessToken] = useLocalStorage<string | null>(
        LOCAL_STORAGE_KEY.ACCESS_TOKEN,
        null
    );
    const [refreshToken, setRefreshToken] = useLocalStorage<string | null>(
        LOCAL_STORAGE_KEY.REFRESH_TOKEN,
        null
    );
    const isLoggedIn = !!accessToken;

    const login = async(signinData: RequestSigninDto) => {
        try {
            const res = await postSignin(signinData);
            if (res) {
                const newAccessToken=  res.data.accessToken;
                const newRefreshToken = res.data.refreshToken;

                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);

                alert("로그인 성공");
                window.location.href='/mypage'
            }
        }
        catch(error) {
            console.error("로그인 오류", error);
            alert("로그인 중 오류가 발생했습니다.");
        }
    };

    const logout = async() => {
        try {
            await postLogout();
        }
        catch(error) {
            console.error("로그아웃 오류", error);
            alert("로그아웃 실패")
        }
        finally {
            setAccessToken(null);
            setRefreshToken(null);

            localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
            localStorage.removeItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN);

            alert("로그아웃 성공");
            window.location.href ="/";
        }
    };

    // google callback 감지
    useEffect(()=> {
        const path = window.location.pathname;
        if (path === "/v1/auth/google/callback") {
            const params = new URLSearchParams(window.location.search);
            const accessToken = params.get("accessToken");
            const refreshToken = params.get("refreshToken");
            const name = params.get("name");

            if(accessToken && refreshToken) {
                localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, accessToken);
                localStorage.setItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN, refreshToken);
                alert(`${decodeURIComponent(name ?? "사용자")}님 환영합니다!`);
                window.location.replace("/mypage");
            }
            else {
                alert("Google 로그인 실패. 다시 시도해주세요.");
                window.location.replace("/login");
            }
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{accessToken, refreshToken, login, logout, isLoggedIn}}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("AuthContext를 찾을 수 없습니다.");
    }
    return context;
}