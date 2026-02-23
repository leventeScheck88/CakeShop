import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
export declare class FilterProductsDto extends PaginationQueryDto {
    category?: string;
    featured?: boolean;
    search?: string;
}
