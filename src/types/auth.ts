export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    email: string;
    password: string;
    nickname: string;
}

export interface AuthResponse {
    userId: number;
    email: string;
    nickname: string;
    accessToken: string;
    refreshToken: string;
}

export interface User {
    userId: number;
    email: string;
    nickname: string;
    profileImage?: string;
}
