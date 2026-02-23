import { Product } from '../../products/entities/product.entity';
export declare class Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    image: string;
    sortOrder: number;
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
}
