import { PermissionGroup } from '../entities/permission-group.entity';

type CreateUserDto = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  permissionGroup?: PermissionGroup;
};

type UpdateUserDto = {
  id: number;
  currentPassword: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
};

export { CreateUserDto, UpdateUserDto };
