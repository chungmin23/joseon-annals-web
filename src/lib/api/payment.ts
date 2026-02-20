import client from "./client";

export interface SubscriptionStatus {
    tier: string;
    isPro: boolean;
    dailyLimit: number;
}

export const getSubscriptionStatus = () =>
    client<SubscriptionStatus>("/api/v1/payments/subscription");

export const POLAR_CHECKOUT_URL =
    process.env.NEXT_PUBLIC_POLAR_CHECKOUT_URL || "";
