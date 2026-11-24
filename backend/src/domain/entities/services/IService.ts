export type PricingModel = "PER_KG" | "PER_ITEM";

export interface IService {
    id: string;
    vendorId: string;
    name: string;
    category: string;
    pricingModel: PricingModel;
    price: number;
    estimatedHours: number;
    tags: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}