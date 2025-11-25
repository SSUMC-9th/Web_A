import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isPremium: boolean;
  user: { email: string; nickname: string } | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  signup: (email: string, password: string, nickname: string) => void;
  upgradeToPremium: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [user, setUser] = useState<{ email: string; nickname: string } | null>(null);

  const login = (email: string, password: string) => {
    setIsAuthenticated(true);
    setUser({ email, nickname: email.split('@')[0] });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsPremium(false);
    setUser(null);
  };

  const signup = (email: string, password: string, nickname: string) => {
    setIsAuthenticated(true);
    setUser({ email, nickname });
  };

  const upgradeToPremium = () => {
    setIsPremium(true);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isPremium,
        user,
        login,
        logout,
        signup,
        upgradeToPremium,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}