import client from "./client";
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
