import client from "./client";
import { ContentItem } from "@/types/content";

export const getRecommendedContents = (personaId: number) => {
    return client<ContentItem[]>(`/api/v1/contents/recommend/${personaId}`);
};

export const saveToLibrary = (contentId: string) => {
    return client<void>("/api/v1/contents/library", {
        method: "POST",
        body: JSON.stringify({ contentId }),
    });
};

export const getLibraryContents = () => {
    return client<ContentItem[]>("/api/v1/contents/library");
};

export const deleteFromLibrary = (contentId: string) => {
    return client<void>(`/api/v1/contents/library/${contentId}`, {
        method: "DELETE"
    });
};
