import { Category } from '../../categories/entities/category.entity';
export declare class Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    price: number;
    priceLabel: string;
    images: string[];
    isAvailable: boolean;
    isFeatured: boolean;
    category: Category;
    categoryId: number;
    createdAt: Date;
    updatedAt: Date;
}
