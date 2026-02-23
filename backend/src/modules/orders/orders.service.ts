import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    referenceImages: string[] = [],
  ): Promise<Order> {
    const order = this.orderRepo.create({
      ...createOrderDto,
      referenceImages,
    });
    return this.orderRepo.save(order);
  }
}
