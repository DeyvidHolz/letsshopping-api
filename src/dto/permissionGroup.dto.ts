type CreatePermissionGroupDto = {
  name: string;
  level: number;
};

type UpdatePermissionGroupDto = {
  name: string;
  level: number;
};

type GetPermissionGroupDto = {
  name: string;
};

type DeletePermissionGroupDto = {
  name: string;
};

export {
  CreatePermissionGroupDto,
  UpdatePermissionGroupDto,
  GetPermissionGroupDto,
  DeletePermissionGroupDto,
};
