type CreateAddressDto = {
  country: string;
  zipCode: string;
  state: string;
  neighbourhood: string;
  street: string;
  number: number;
  isMain?: boolean;
};

type UpdateAddressDto = {
  id?: number;
  country: string;
  zipCode: string;
  state: string;
  neighbourhood: string;
  street: string;
  number: number;
  isMain?: boolean;
};

type GetAddressDto = {
  id: number;
};

type DeleteAddressDto = {
  id: number;
};

export { CreateAddressDto, UpdateAddressDto, GetAddressDto, DeleteAddressDto };
