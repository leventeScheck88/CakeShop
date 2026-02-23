import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OrderStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @Column()
  customerPhone: string;

  @Column({ nullable: true })
  productType: string;

  @Column({ type: 'text' })
  requirements: string;

  @Column({ type: 'date', nullable: true })
  eventDate: Date;

  @Column({ nullable: true })
  eventType: string;

  @Column('text', { array: true, default: '{}' })
  referenceImages: string[];

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.NEW,
  })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
