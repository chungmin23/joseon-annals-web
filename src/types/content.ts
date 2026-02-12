export type ContentType = 'VIDEO' | 'BOOK';

export interface ContentItem {
    contentId: string; // or number
    type: ContentType;
    title: string;
    description: string; // Channel name or Author/Publisher
    thumbnailUrl: string;
    linkUrl: string;
    isSaved?: boolean;

    // Specific fields
    videoDuration?: string; // "12:30"
    viewCount?: string; // "12만회"

    // Book specific (if any extra)
    author?: string; // Can map to description
    publisher?: string;
}

export interface RecommendResponse {
    contents: ContentItem[];
}
