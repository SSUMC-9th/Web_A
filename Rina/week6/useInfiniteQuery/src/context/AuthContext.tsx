import { createContext, useCallback, useContext, useEffect, useState, type PropsWithChildren } from "react";
import type { RequestSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { getMyInfo, postLogout, postSignin } from "../apis/auth";
import { api } from "../apis/axios";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface AuthContextType {
    accessToken : string | null;
    refreshToken : string | null;
    login: (signInData: RequestSigninDto) => Promise<void>;
    logout: () => Promise<void>;
    userName : string | null;
    isLoggedIn: boolean;
    socialLogin: (tokens: { accessToken: string; refreshToken: string }) => void;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken:null,
    login:async() => {},
    logout: async() => {},
    userName : null,
    isLoggedIn: false,
    socialLogin: ()=>{},
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
    const [userName, setUserName] = useState<string | null>(null);

    const isLoggedIn = !!accessToken;

    useEffect(() => {
        (async() => {
            try {
                if (!accessToken) return;
                const me = await getMyInfo();
                setUserName(me.data?.name ?? null);
            }
            catch (err){
                console.error("getMyInfo() 실패 : ", err)
            }
        }) ();
    }, [accessToken]);
    const login = async(signinData: RequestSigninDto) => {
        try {
            const res = await postSignin(signinData);
            if (res) {
                const newAccessToken=  res.data.accessToken;
                const newRefreshToken = res.data.refreshToken;

                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);
                setUserName(res.data.name ?? null);

                alert("로그인 성공");
            }
        }
        catch(error) {
            console.error("로그인 오류", error);
            alert("로그인 중 오류가 발생했습니다.");
        }
    };

    const qc = useQueryClient();
    let shouldShowSuccess = true;
    const logout = async() => {
        
        try {
            await postLogout();
        }
        catch(error) {
            if (axios.isAxiosError(error) && error.response?.status === 401 ) {
                shouldShowSuccess = true;
            } else {
                console.error("로그아웃 오류", error);
                shouldShowSuccess = false;
            }
        }
        finally {
            setAccessToken(null);
            setRefreshToken(null);
            setUserName(null);

            localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
            localStorage.removeItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
            delete api.defaults.headers.common.Authorization;

            await qc.cancelQueries();
            qc.clear();

            if (shouldShowSuccess) alert("로그아웃 성공");
            else alert("로그아웃 실패");
            window.location.href ="/";
        }
    };

    const socialLogin = useCallback(({accessToken, refreshToken, name}:{
            accessToken: string;
            refreshToken: string;
            name?: string
        }) => {
                setAccessToken(accessToken);
                setRefreshToken(refreshToken);
                if (name) setUserName(name);
        },[setAccessToken, setRefreshToken]);

    return (
        <AuthContext.Provider
            value={{accessToken, refreshToken, login, logout, userName, isLoggedIn, socialLogin,}}
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