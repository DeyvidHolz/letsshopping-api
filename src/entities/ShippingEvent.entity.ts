import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { Shipping } from './Shipping.entity';

@Entity({ name: 'shipping_events' })
export class ShippingEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'date' })
  date: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(() => Shipping, (shipping) => shipping.events)
  @JoinTable()
  shipping: Shipping;
}
