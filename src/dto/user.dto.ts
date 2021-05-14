type CreateUserDto = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
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
