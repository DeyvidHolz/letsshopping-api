import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { ShopInfo } from './ShopInfo.entity';

@Entity({ name: 'shop_social' })
export class ShopSocial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  value: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(() => ShopInfo, (shopInfo) => shopInfo.socials)
  @JoinTable()
  shopInfo: ShopInfo;
}
