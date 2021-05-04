type createAddressPayload = {
  country: string;
  zipCode: string;
  state: string;
  neighbourhood: string;
  street: string;
  number: number;
  isMain?: boolean;
};

type updateAddressPayload = {
  id?: number;
  country: string;
  zipCode: string;
  state: string;
  neighbourhood: string;
  street: string;
  number: number;
  isMain?: boolean;
};

export { createAddressPayload, updateAddressPayload };
