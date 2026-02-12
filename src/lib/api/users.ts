import client from "./client";
import { UserProfile, UserPreferences } from "@/types/user";

export const getMe = () => {
    return client<UserProfile>("/api/v1/users/me");
};

// Helper to map preferences to API interest format
const mapPreferencesToInterestItems = (data: UserPreferences) => {
    const items = [];

    // Era
    if (data.preferredEra) {
        items.push({
            category: "era",
            value: data.preferredEra, // 'EARLY', 'MID', etc.
            weight: 1.0
        });
    }

    // Interests
    if (data.interests) {
        data.interests.forEach(interest => {
            items.push({
                category: "topic",
                value: interest, // 'POLITICS', 'MILITARY', etc.
                weight: 1.0
            });
        });
    }

    // Style
    if (data.communicationStyle) {
        items.push({
            category: "style",
            value: data.communicationStyle, // 'EASY', 'NORMAL', etc.
            weight: 1.0
        });
    }

    return { interests: items };
};

export const updatePreferences = (data: UserPreferences) => {
    const payload = mapPreferencesToInterestItems(data);
    return client<void>("/api/v1/users/me/interests", {
        method: "PUT",
        body: JSON.stringify(payload),
    });
};
