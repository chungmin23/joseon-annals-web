
export type RoleType = 'USER' | 'ASSISTANT' | 'SYSTEM';

// Backend ChatSource (from ChatMessageResponse)
export interface ChatSource {
    documentId: number;
    content: string;
    similarity: number;
    keywordScore: number;
    hybridScore: number;
}

// Matches ChatMessageResponse.java
export interface Message {
    messageId: string;
    role: RoleType;
    content: string;
    sources?: ChatSource[];
    timestamp: number; // Unix epoch milliseconds
}

// Matches ChatRoomResponse.java (flat structure, no nested persona)
export interface ChatRoom {
    roomId: number;
    personaId: number;
    personaName: string;
    personaImage: string;
    title: string;
    greeting?: string;
    createdAt: string;
    lastMessageAt: string;
}

export interface CreateRoomRequest {
    personaId: number;
}

export interface SendMessageRequest {
    roomId: string;
    content: string;
}
