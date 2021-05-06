type createAddressDto = {
  country: string;
  zipCode: string;
  state: string;
  neighbourhood: string;
  street: string;
  number: number;
  isMain?: boolean;
};

type updateAddressDto = {
  id?: number;
  country: string;
  zipCode: string;
  state: string;
  neighbourhood: string;
  street: string;
  number: number;
  isMain?: boolean;
};

export { createAddressDto, updateAddressDto };
