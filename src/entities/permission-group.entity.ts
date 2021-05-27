import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  JoinTable,
  OneToMany,
} from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'permission_groups' })
export class PermissionGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'int', default: 0 })
  level: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @OneToMany(() => User, (user) => user.permissionGroup, {
    persistence: false,
  })
  @JoinTable()
  users: User[];
}
