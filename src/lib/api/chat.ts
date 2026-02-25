import client from "./client";
import { useAuthStore } from "@/lib/store/auth-store";
import { ChatRoom, Message, CreateRoomRequest, SendMessageRequest } from "@/types/chat";

export const getChatRooms = () => {
    return client<ChatRoom[]>("/api/v1/chat/rooms");
};

export const getChatRoom = (roomId: string) => {
    return client<ChatRoom>(`/api/v1/chat/rooms/${roomId}`);
};

export const createChatRoom = (data: CreateRoomRequest) => {
    return client<ChatRoom>("/api/v1/chat/rooms", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

export const getMessages = (roomId: string) => {
    return client<Message[]>(`/api/v1/chat/rooms/${roomId}/messages`);
};

export const sendMessage = (roomId: string, message: string) => {
    return client<Message>(`/api/v1/chat/rooms/${roomId}/messages`, {
        method: "POST",
        body: JSON.stringify({ message }),
    });
};

export const streamMessage = (roomId: string, message: string): Promise<Response> => {
    const { accessToken } = useAuthStore.getState();
    return fetch(`/api/v1/chat/rooms/${roomId}/messages/stream`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ message }),
    });
};

export interface DailyUsage {
    usedCount: number;
    limitCount: number;
    remainingCount: number;
}

export const getDailyUsage = () => {
    return client<DailyUsage>("/api/v1/chat/daily-usage");
};
