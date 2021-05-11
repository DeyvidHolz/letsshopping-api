import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { Address } from './Address.entity';
import { Cart } from './Cart.entity';
import { Notification } from './Notification.entity';
import { Order } from './Order.entity';
import { PermissionGroup } from './PermissionGroup.entity';
import { ProductReview } from './ProductReview.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'date' })
  birthDate: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @OneToMany(() => Address, (address) => address.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  addresses: Address[];

  @ManyToOne(
    () => PermissionGroup,
    (permissionGroup) => permissionGroup.users,
    {
      eager: true,
      cascade: true,
      persistence: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinTable()
  permissionGroup: PermissionGroup;

  @OneToOne(() => Cart, (cart) => cart.user, {
    cascade: true,
    persistence: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  cart: Cart;

  @OneToMany(() => Order, (order) => order.user, {
    cascade: true,
  })
  @JoinTable()
  orders: Order[];

  @ManyToMany(() => Notification, (notification) => notification.users, {
    cascade: true,
    persistence: false,
  })
  @JoinTable()
  notifications: Notification[];

  @OneToMany(() => ProductReview, (productReview) => productReview.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  productReviews: ProductReview[];
}
