import { useAuthStore } from "@/lib/store/auth-store";
import { ApiResponse } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

async function client<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { accessToken, refreshToken, setAuth, clearAuth } = useAuthStore.getState();

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    try {
        console.log(`[API] Requesting: ${BASE_URL}${endpoint}`, config);
        const response = await fetch(`${BASE_URL}${endpoint}`, config);

        if (response.status === 401) {
            // Token expired, try refresh
            if (refreshToken) {
                try {
                    const refreshResponse = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ refreshToken }),
                    });

                    if (refreshResponse.ok) {
                        const refreshData = await refreshResponse.json();
                        if (refreshData.code === "SUCCESS") {
                            const { accessToken: newAccess, refreshToken: newRefresh } = refreshData.data;
                            const { user } = useAuthStore.getState();

                            if (user) {
                                setAuth(user, newAccess, newRefresh);
                            }

                            // Retry original request with new token
                            headers["Authorization"] = `Bearer ${newAccess}`;
                            const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
                                ...options,
                                headers,
                            });

                            const retryData = await retryResponse.json();
                            if (retryData.code !== "SUCCESS") {
                                throw new Error(retryData.message || "Request failed");
                            }
                            return retryData.data;
                        }
                    }
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);
                }
            }

            // Refresh failed or no refresh token
            clearAuth();
            window.location.href = "/login";
            throw new Error("Session expired");
        }

        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            throw new Error(`Unexpected response from server (non-JSON): ${text.slice(0, 100)}...`);
        }

        const data: ApiResponse<T> = await response.json();

        if (data.code !== "SUCCESS") {
            throw new Error(data.message || "API Error");
        }

        return data.data as T;
    } catch (error) {
        console.error("API Request Error:", error);
        throw error;
    }
}

export default client;
