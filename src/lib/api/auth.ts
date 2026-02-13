import client from "./client";
import { AuthResponse, LoginRequest, SignupRequest } from "@/types/auth";

// 로그인은 client() 우회 — 401 인터셉터가 /login으로 리다이렉트하기 때문
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    const json = await response.json();
    if (json.code !== "SUCCESS") {
        throw new Error(json.message || "로그인에 실패했습니다.");
    }
    return json.data as AuthResponse;
};

export const signup = (data: SignupRequest) => {
    return client<AuthResponse>("/api/v1/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

export const logout = (refreshToken: string) => {
    return client<null>("/api/v1/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
    });
};

export const forgotPassword = async (email: string): Promise<void> => {
    const response = await fetch(`/api/v1/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });
    const json = await response.json();
    if (json.code !== "SUCCESS") {
        throw new Error(json.message || "요청에 실패했습니다.");
    }
};

export const changePassword = (currentPassword: string, newPassword: string) => {
    return client<null>("/api/v1/auth/change-password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
    });
};
