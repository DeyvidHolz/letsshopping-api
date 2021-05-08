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

export { CreateAddressDto, UpdateAddressDto };
