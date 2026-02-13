export type ContentType = 'VIDEO' | 'BOOK';

export interface ContentItem {
    contentId: number;
    contentType: ContentType;
    title: string;
    description: string;
    thumbnailUrl: string;
    linkUrl: string;
    isSaved?: boolean;
}
