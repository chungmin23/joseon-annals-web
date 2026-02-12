import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/auth';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isOnboarded: boolean;
    setAuth: (user: User, accessToken: string, refreshToken: string) => void;
    clearAuth: () => void;
    setOnboarded: (isOnboarded: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isOnboarded: false,
            setAuth: (user, accessToken, refreshToken) =>
                set({ user, accessToken, refreshToken }),
            clearAuth: () =>
                set({ user: null, accessToken: null, refreshToken: null, isOnboarded: false }),
            setOnboarded: (isOnboarded) => set({ isOnboarded }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
