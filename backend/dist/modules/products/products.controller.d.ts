import { ProductsService } from './products.service';
import { FilterProductsDto } from './dto/filter-products.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(filterDto: FilterProductsDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("./entities/product.entity").Product>>;
    findOne(id: number): Promise<import("./entities/product.entity").Product>;
}
