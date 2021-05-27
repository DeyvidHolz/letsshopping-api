import dotenv from 'dotenv';
import { getConnection } from 'typeorm';
import { CreatePermissionGroupDto } from '../dto/permission-group.dto';
import { PermissionGroup } from '../entities/permission-group.entity';

dotenv.config();

const seeds: CreatePermissionGroupDto[] = [
  { name: process.env.DEFAULT_ADMIN_PERMISSION_GROUP, level: 1 },
  { name: process.env.DEFAULT_PERMISSION_GROUP, level: 0 },
];

export async function createPermissionGroupSeeds() {
  const repository = getConnection().getRepository(PermissionGroup);
  const qty = await repository.count();
  if (qty > 0) return;

  const permissionGroups = repository.create(seeds as any);
  await repository.save(permissionGroups);
}
