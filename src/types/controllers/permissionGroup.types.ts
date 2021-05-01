type createPermissionGroupPayload = {
  name: string;
  level: number;
};

type updatePermissionGroupPayload = {
  name: string;
  level: number;
};

export { createPermissionGroupPayload, updatePermissionGroupPayload };
