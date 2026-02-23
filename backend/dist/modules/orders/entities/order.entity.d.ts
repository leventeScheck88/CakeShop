export declare enum OrderStatus {
    NEW = "new",
    CONTACTED = "contacted",
    CONFIRMED = "confirmed",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class Order {
    id: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    productType: string;
    requirements: string;
    eventDate: Date;
    eventType: string;
    referenceImages: string[];
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
}
