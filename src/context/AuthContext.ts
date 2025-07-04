// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { loginUser, registerUser, logoutUser as apiLogout, fetchCurrentUser } from "../api/auth";
import type { RegisterData, UserData } from "../api/auth";
import { getStoredAccessToken, getStoredRefreshToken, clearTokens } from "../api/api";

interface AuthContextType {
  user: UserData | null;
  accessToken: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(getStoredAccessToken());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initialize() {
      const token = getStoredAccessToken();
      const refresh = getStoredRefreshToken();
      if (token && refresh) {
        try {
          const data = await fetchCurrentUser();
          setUser(data);
          setAccessToken(token);
        } catch {
          clearTokens();
          setUser(null);
          setAccessToken(null);
        }
      }
      setLoading(false);
    }
    initialize();
  }, []);

  async function login(username: string, password: string) {
    setLoading(true);
    try {
      const { tokens, user } = await loginUser({ username, password });
      setAccessToken(tokens.access);
      setUser(user);
    } catch (err) {
      setUser(null);
      setAccessToken(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function register(data: RegisterData) {
    setLoading(true);
    try {
      const { tokens, user } = await registerUser(data);
      setAccessToken(tokens.access);
      setUser(user);
    } catch (err) {
      setUser(null);
      setAccessToken(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    apiLogout();
    setUser(null);
    setAccessToken(null);
  }

  const value: AuthContextType = {
    user,
    accessToken,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}