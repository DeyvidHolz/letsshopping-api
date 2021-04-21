import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { ShopEmail } from './ShopEmail.entity';
import { ShopPhone } from './ShopPhone.entity';

import { ShopSocial } from './ShopSocial.entity';

@Entity({ name: 'shop_info' })
export class ShopInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => ShopSocial, (social) => social.shopInfo, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  socials: ShopSocial[];

  @OneToMany(() => ShopPhone, (phone) => phone.shopInfo, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  phones: ShopPhone[];

  @OneToMany(() => ShopPhone, (email) => email.shopInfo, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  emails: ShopEmail[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
