// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { loginUser, registerUser, registerSupplier, registerCustomer, logoutUser as apiLogout, fetchCurrentUser } from "../api/auth";
import type { RegisterData, SupplierRegisterData, CustomerRegisterData, UserData } from "../api/auth";
import { getStoredAccessToken, getStoredRefreshToken, clearTokens } from "../api/api";

interface AuthContextType {
  user: UserData | null;
  accessToken: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  registerUser: (data: RegisterData) => Promise<void>;
  registerSupplier: (data: SupplierRegisterData) => Promise<void>;
  registerCustomer: (data: CustomerRegisterData) => Promise<void>;
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
    console.log("AuthContext: login called");
    setLoading(true);
    try {
      const { tokens, user } = await loginUser({ username, password });
      setAccessToken(tokens.access);
      setUser(user);
    } catch (err: any) {
      setUser(null);
      setAccessToken(null);
      throw new Error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function registerUser(data: RegisterData) {
    console.log("AuthContext: registerUser called with:", data);
    setLoading(true);
    try {
      const { tokens, user } = await registerUser(data);
      setAccessToken(tokens.access);
      setUser(user);
    } catch (err: any) {
      setUser(null);
      setAccessToken(null);
      throw new Error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  async function registerSupplier(data: SupplierRegisterData) {
    console.log("AuthContext: registerSupplier called with:", data);
    setLoading(true);
    try {
      const { tokens, user } = await registerSupplier(data);
      setAccessToken(tokens.access);
      setUser(user);
    } catch (err: any) {
      setUser(null);
      setAccessToken(null);
      throw new Error(err.message || "Supplier registration failed");
    } finally {
      setLoading(false);
    }
  }

  async function registerCustomer(data: CustomerRegisterData) {
    console.log("AuthContext: registerCustomer called with:", data);
    setLoading(true);
    try {
      const { tokens, user } = await registerCustomer(data);
      setAccessToken(tokens.access);
      setUser(user);
    } catch (err: any) {
      setUser(null);
      setAccessToken(null);
      throw new Error(err.message || "Customer registration failed");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    console.log("AuthContext: logout called");
    apiLogout();
    setUser(null);
    setAccessToken(null);
  }

  const value: AuthContextType = {
    user,
    accessToken,
    loading,
    login,
    registerUser,
    registerSupplier,
    registerCustomer,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}