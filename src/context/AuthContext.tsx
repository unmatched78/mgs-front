// // src/context/AuthContext.tsx
// import { createContext, useContext, useEffect, useState } from "react";
// import type { ReactNode } from "react";
// import { loginUser, registerUser, registerSupplier, registerCustomer, logoutUser as apiLogout } from "../api/auth";
// import type { RegisterData, SupplierRegisterData, CustomerRegisterData, UserData } from "../api/auth";
// import { getStoredAccessToken, getStoredRefreshToken,storeTokens, clearTokens, setUpdateUserCallback } from "../api/api";
// import axios from "axios";

// interface AuthContextType {
//   user: UserData | null;
//   accessToken: string | null;
//   loading: boolean;
//   login: (username: string, password: string) => Promise<void>;
//   registerUser: (data: RegisterData) => Promise<void>;
//   registerSupplier: (data: SupplierRegisterData) => Promise<void>;
//   registerCustomer: (data: CustomerRegisterData) => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function useAuth(): AuthContextType {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// }

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export function AuthProvider({ children }: AuthProviderProps) {
//   const [user, setUser] = useState<UserData | null>(null);
//   const [accessToken, setAccessToken] = useState<string | null>(getStoredAccessToken());
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     // Register callback for Axios interceptor to update user state
//     setUpdateUserCallback((userData: UserData | null) => {
//       setUser(userData);
//     });

//     async function initialize() {
//       const token = getStoredAccessToken();
//       const refresh = getStoredRefreshToken();
//       if (token && refresh) {
//         try {
//           const response = await axios.post<{
//             access: string;
//             user: UserData;
//           }>(
//             `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"}/auth/refresh/`,
//             { refresh },
//             { headers: { "Content-Type": "application/json" } }
//           );
//           const { access, user } = response.data;
//           setUser(user);
//           setAccessToken(access);
//           // Update tokens in localStorage
//           storeTokens(access, refresh);
//         } catch (error) {
//           console.error("Session restoration failed:", error);
//           clearTokens();
//           setUser(null);
//           setAccessToken(null);
//         }
//       }
//       setLoading(false);
//     }
//     initialize();
//   }, []);

//   async function login(username: string, password: string) {
//     console.log("AuthContext: login called");
//     setLoading(true);
//     try {
//       const { tokens, user } = await loginUser({ username, password });
//       setAccessToken(tokens.access);
//       setUser(user);
//     } catch (err: any) {
//       setUser(null);
//       setAccessToken(null);
//       throw new Error(err.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function registerUser(data: RegisterData) {
//     console.log("AuthContext: registerUser called with:", data);
//     setLoading(true);
//     try {
//       const { tokens, user } = await registerUser(data);
//       setAccessToken(tokens.access);
//       setUser(user);
//     } catch (err: any) {
//       setUser(null);
//       setAccessToken(null);
//       throw new Error(err.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function registerSupplier(data: SupplierRegisterData) {
//     console.log("AuthContext: registerSupplier called with:", data);
//     setLoading(true);
//     try {
//       const { tokens, user } = await registerSupplier(data);
//       setAccessToken(tokens.access);
//       setUser(user);
//     } catch (err: any) {
//       setUser(null);
//       setAccessToken(null);
//       throw new Error(err.message || "Supplier registration failed");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function registerCustomer(data: CustomerRegisterData) {
//     console.log("AuthContext: registerCustomer called with:", data);
//     setLoading(true);
//     try {
//       const { tokens, user } = await registerCustomer(data);
//       setAccessToken(tokens.access);
//       setUser(user);
//     } catch (err: any) {
//       setUser(null);
//       setAccessToken(null);
//       throw new Error(err.message || "Customer registration failed");
//     } finally {
//       setLoading(false);
//     }
//   }

//   function logout() {
//     console.log("AuthContext: logout called");
//     apiLogout();
//     setUser(null);
//     setAccessToken(null);
//   }

//   const value: AuthContextType = {
//     user,
//     accessToken,
//     loading,
//     login,
//     registerUser,
//     registerSupplier,
//     registerCustomer,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }
// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { loginUser, registerUser, registerSupplier, registerCustomer, logoutUser as apiLogout } from "../api/auth";
import type { RegisterData, SupplierRegisterData, CustomerRegisterData, UserData } from "../api/auth";
import { getStoredAccessToken, getStoredRefreshToken, clearTokens, setUpdateUserCallback, storeTokens } from "../api/api";
import axios from "axios";

// Debug import to ensure storeTokens is available
console.log("storeTokens imported:", typeof storeTokens); // Should log "function"

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
    // Register callback for Axios interceptor to update user state
    setUpdateUserCallback((userData: UserData | null) => {
      console.log("Updating user from interceptor:", userData);
      setUser(userData);
    });

    async function initialize() {
      const token = getStoredAccessToken();
      const refresh = getStoredRefreshToken();
      if (token && refresh && !user) { // Avoid re-running if user is already set
        try {
          console.log("Attempting session restoration with /auth/refresh/");
          const response = await axios.post<{
            access: string;
            user: UserData;
          }>(
            `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"}/auth/refresh/`,
            { refresh },
            { headers: { "Content-Type": "application/json" } }
          );
          console.log("Session restoration response:", response.data);
          const { access, user: fetchedUser } = response.data;
          setUser(fetchedUser);
          setAccessToken(access);
          if (typeof storeTokens === "function") {
            storeTokens(access, refresh);
            console.log("Tokens stored:", { access, refresh });
          } else {
            console.error("storeTokens is not a function:", storeTokens);
            throw new Error("storeTokens is not defined");
          }
        } catch (error: any) {
          console.error("Session restoration failed:", error.message, error.response?.data);
          if (error.response?.status === 401 || error.response?.status === 400) {
            clearTokens();
            setUser(null);
            setAccessToken(null);
            console.log("Cleared tokens due to invalid refresh token");
          }
        }
      } else {
        console.log("No tokens found or user already set:", { token, refresh, user });
      }
      setLoading(false);
    }
    initialize();
  }, []); // Empty dependency array to run once on mount

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
    set没了
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