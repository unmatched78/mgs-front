// // // src/api/auth.ts
// // import api, { storeTokens, clearTokens } from "./api";

// // export interface LoginCredentials {
// //   identifier: string; // Updated to match login with username or email
// //   password: string;
// // }

// // export interface RegisterData {
// //   username: string;
// //   email: string;
// //   phone: string;
// //   role: "driver" | "client";
// //   password: string;
// //   license_number?: string;
// //   frequent_location?: string;
// //   personalID?: File;
// // }

// // export interface TokenPair {
// //   access: string;
// //   refresh: string;
// // }

// // export interface UserData {
// //   id: number;
// //   username: string;
// //   role: string;
// // }

// // // LOGIN: POST /api/auth/token/login/
// // export async function loginUser(creds: LoginCredentials): Promise<TokenPair> {
// //   const response = await api.post<{
// //     tokens: { access: string; refresh: string };
// //     user: UserData;
// //   }>("/auth/token/login/", {
// //     identifier: creds.identifier, // Updated to use identifier
// //     password: creds.password,
// //   });

// //   const { access, refresh } = response.data.tokens;
// //   storeTokens(access, refresh);
// //   return { access, refresh };
// // }

// // // REGISTER: POST /api/auth/register/
// // export async function registerUser(data: RegisterData): Promise<TokenPair> {
// //   const formData = new FormData();
// //   formData.append("username", data.username);
// //   formData.append("email", data.email);
// //   formData.append("phone", data.phone);
// //   formData.append("role", data.role);
// //   formData.append("password", data.password);
// //   if (data.role === "driver") {
// //     if (data.license_number) formData.append("license_number", data.license_number);
// //     if (data.frequent_location) formData.append("frequent_location", data.frequent_location);
// //     if (data.personalID) formData.append("personalID", data.personalID);
// //   }

// //   const response = await api.post<{
// //     tokens: { access: string; refresh: string };
// //     user: UserData;
// //   }>("/auth/register/", formData, {
// //     headers: { "Content-Type": "multipart/form-data" },
// //   });

// //   const { access, refresh } = response.data.tokens;
// //   storeTokens(access, refresh);
// //   return { access, refresh };
// // }

// // // LOGOUT: Clear tokens on client
// // export function logoutUser() {
// //   clearTokens();
// // }

// // // FETCH CURRENT USER: GET /api/auth/user/
// // export async function fetchCurrentUser(): Promise<UserData> {
// //   const response = await api.get<UserData>("/auth/user/");
// //   return response.data;
// // }
// // src/api/auth.ts
// import api, { storeTokens, clearTokens } from "./api";

// export interface LoginCredentials {
//   username: string;
//   password: string;
// }

// export interface RegisterData {
//   username: string;
//   email: string;
//   phone: string;
//   role: "driver" | "client";
//   password: string;
//   license_number?: string;
//   frequent_location?: string;
//   personalID?: File;
// }

// export interface TokenPair {
//   access: string;
//   refresh: string;
// }

// export interface UserData {
//   id: number;
//   username: string;
//   role: string;
// }

// export async function loginUser(creds: LoginCredentials): Promise<{ tokens: TokenPair; user: UserData }> {
//   console.log("Sending login payload:", {
//     username: creds.username,
//     password: creds.password,
//   });
//   try {
//     const response = await api.post<{
//       tokens: { access: string; refresh: string };
//       user: UserData;
//     }>("/auth/token/login/", {
//       username: creds.username,
//       password: creds.password,
//     });
//     const { access, refresh } = response.data.tokens;
//     storeTokens(access, refresh);
//     return response.data;
//   } catch (error: any) {
//     console.error("Login error:", error.response?.data);
//     throw error;
//   }
// }

// export async function registerUser(data: RegisterData): Promise<{ tokens: TokenPair; user: UserData }> {
//   const formData = new FormData();
//   formData.append("username", data.username);
//   formData.append("email", data.email);
//   formData.append("phone", data.phone);
//   formData.append("role", data.role);
//   formData.append("password", data.password);
//   if (data.role === "driver") {
//     if (data.license_number) formData.append("license_number", data.license_number);
//     if (data.frequent_location) formData.append("frequent_location", data.frequent_location);
//     if (data.personalID) formData.append("personalID", data.personalID);
//   }

//   console.log("Sending register payload:", Object.fromEntries(formData));
//   try {
//     const response = await api.post<{
//       tokens: { access: string; refresh: string };
//       user: UserData;
//     }>("/auth/register/", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     const { access, refresh } = response.data.tokens;
//     storeTokens(access, refresh);
//     return response.data;
//   } catch (error: any) {
//     console.error("Register error:", error.response?.data);
//     throw error;
//   }
// }

// export function logoutUser() {
//   clearTokens();
// }

// export async function fetchCurrentUser(): Promise<UserData> {
//   try {
//     const response = await api.get<UserData>("/auth/user/");
//     return response.data;
//   } catch (error: any) {
//     console.error("Fetch user error:", error.response?.data);
//     throw error;
//   }
// }
// src/api/auth.ts
import api, { storeTokens, clearTokens } from "./api";
import { AxiosError } from "axios";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SupplierRegisterData {
  email: string;
  password: string;
  company_name: string;
  contact_email: string;
  contact_phone: string;
  address?: string;
}

export interface CustomerRegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface TokenPair {
  access: string;
  refresh: string;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  role: "shop" | "vet" | "client" | "supplier";
}

export async function loginUser(creds: LoginCredentials): Promise<{ tokens: TokenPair; user: UserData }> {
  console.log("Sending login payload:", {
    username: creds.username,
    password: creds.password,
  });
  try {
    const response = await api.post<{
      access: string;
      refresh: string;
      user: UserData;
    }>("/auth/token/", {
      username: creds.username,
      password: creds.password,
    });
    const { access, refresh, user } = response.data;
    storeTokens(access, refresh);
    return { tokens: { access, refresh }, user };
  } catch (error: any) {
    console.error("Login error:", error.response?.data);
    throw new Error(error.response?.data?.detail || "Login failed");
  }
}

export async function registerSupplier(data: SupplierRegisterData): Promise<{ tokens: TokenPair; user: UserData }> {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("company_name", data.company_name);
  formData.append("contact_email", data.contact_email);
  formData.append("contact_phone", data.contact_phone);
  if (data.address) formData.append("address", data.address);

  console.log("Sending supplier register payload:", Object.fromEntries(formData));
  try {
    const response = await api.post<{
      access: string;
      refresh: string;
      user: UserData;
    }>("/auth/register-supplier/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const { access, refresh, user } = response.data;
    storeTokens(access, refresh);
    return { tokens: { access, refresh }, user };
  } catch (error: any) {
    console.error("Register supplier error:", error.response?.data);
    throw new Error(error.response?.data?.detail || "Supplier registration failed");
  }
}

export async function registerCustomer(data: CustomerRegisterData): Promise<{ tokens: TokenPair; user: UserData }> {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("first_name", data.first_name);
  formData.append("last_name", data.last_name);

  console.log("Sending customer register payload:", Object.fromEntries(formData));
  try {
    const response = await api.post<{
      access: string;
      refresh: string;
      user: UserData;
    }>("/auth/register-customer/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const { access, refresh, user } = response.data;
    storeTokens(access, refresh);
    return { tokens: { access, refresh }, user };
  } catch (error: any) {
    console.error("Register customer error:", error.response?.data);
    throw new Error(error.response?.data?.detail || "Customer registration failed");
  }
}

export function logoutUser() {
  clearTokens();
}

export async function fetchCurrentUser(): Promise<UserData> {
  try {
    const response = await api.get<UserData>("/auth/user/");
    return response.data;
  } catch (error: any) {
    console.error("Fetch user error:", error.response?.data);
    throw new Error(error.response?.data?.detail || "Failed to fetch user data");
  }
}