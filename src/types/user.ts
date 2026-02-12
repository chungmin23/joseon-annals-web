export type EraType = 'EARLY' | 'MID' | 'LATE' | 'END'; // EARLY: 세종(전기), LATE: 정조(후기)
export type InterestType = 'POLITICS' | 'MILITARY' | 'SCIENCE' | 'CULTURE' | 'PEOPLE';
export type CommunicationStyle = 'EASY' | 'NORMAL' | 'HARD';

export interface UserPreferences {
    preferredEra?: EraType;
    interests?: InterestType[];
    communicationStyle?: CommunicationStyle;
}

export interface UserProfile extends UserPreferences {
    userId: number;
    email: string;
    nickname: string;
    profileImage?: string;
    isOnboarded: boolean;
    createdAt: string;
}
