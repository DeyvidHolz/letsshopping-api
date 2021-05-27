import dotenv from 'dotenv';
import { getConnection } from 'typeorm';
import { CreateUserDto } from '../dto/user.dto';
import { PermissionGroup } from '../entities/permission-group.entity';
import { User } from '../entities/user.entity';
import CryptHelper from '../helpers/crypt.helper';

dotenv.config();

const seeds: CreateUserDto[] = [
  {
    username: 'admin',
    email: 'admin@admin.com',
    firstName: 'Admin',
    lastName: 'User',
    password: CryptHelper.encryptPassword('admin'),
    birthDate: '1999-12-10',
    permissionGroup: { id: 1 } as PermissionGroup,
  },
];

export async function createUserSeeds() {
  const repository = getConnection().getRepository(User);
  const qty = await repository.count();
  if (qty > 0) return;

  const user = repository.create(seeds as any);
  await repository.save(user);
}
