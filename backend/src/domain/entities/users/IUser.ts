export interface IGeoJSONPoint {
    type: "Point";
    coordinates: [longitude: number, latitude: number];
}

export type INotifications = {
    orderUpdates:boolean,
    promotions: boolean,
    aiSuggestions: boolean
}

export interface IAddress {
    id: string;
    label: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    location: IGeoJSONPoint;
    isDefault: boolean;
}

export interface IUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    googleId?: string;
    passwordHash: string;
    profileImage: string;
    walletBalance: number;
    fcmToken: string[];
    notifications: INotifications;
    addresses: IAddress[];
    isVerified: boolean;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}