type createPermissionGroupPayload = {
  name: string;
  level: number;
};

type updatePermissionGroupPayload = {
  id: number;
  name: string;
  level: number;
};

export { createPermissionGroupPayload, updatePermissionGroupPayload };
