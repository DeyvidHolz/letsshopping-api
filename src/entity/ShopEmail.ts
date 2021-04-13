import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { ShopInfo } from './ShopInfo';

@Entity({ name: 'shop_emails' })
export class ShopEmail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(() => ShopInfo, (shopInfo) => shopInfo.emails)
  @JoinTable()
  shopInfo: ShopInfo;
}
