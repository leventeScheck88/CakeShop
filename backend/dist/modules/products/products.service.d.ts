import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { FilterProductsDto } from './dto/filter-products.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
export declare class ProductsService {
    private readonly productRepo;
    constructor(productRepo: Repository<Product>);
    findAll(filterDto: FilterProductsDto): Promise<PaginatedResult<Product>>;
    findOne(id: number): Promise<Product>;
    findRelated(productId: number, categoryId: number, limit?: number): Promise<Product[]>;
}
