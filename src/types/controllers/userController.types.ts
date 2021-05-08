type JwtUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  cart: { id: number };
  permissionGroup: { name: string; level: number };
};

export { JwtUser };
