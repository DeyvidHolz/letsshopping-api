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

@Entity({ name: 'shop_phones' })
export class ShopPhone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(() => ShopInfo, (shopInfo) => shopInfo.phones)
  @JoinTable()
  shopInfo: ShopInfo;
}
