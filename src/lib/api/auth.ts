import client from "./client";
import { AuthResponse, LoginRequest, SignupRequest } from "@/types/auth";

export const login = (data: LoginRequest) => {
    return client<AuthResponse>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
    });
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
