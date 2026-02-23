import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { multerConfig } from '../../common/config/multer.config';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('referenceImages', 5, multerConfig))
  create(
    @Body() createOrderDto: CreateOrderDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const imagePaths = files?.map((file) => `/uploads/${file.filename}`) || [];
    return this.ordersService.create(createOrderDto, imagePaths);
  }
}
