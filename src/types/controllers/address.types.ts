type createAddressPayload = {
  country: string;
  zipcode: string;
  state: string;
  neighbourhood: string;
  street: string;
  number: number;
  isMain: boolean;
};

type updateAddressPayload = {
  id: number;
  country: string;
  zipcode: string;
  state: string;
  neighbourhood: string;
  street: string;
  number: number;
  isMain: boolean;
};

export { createAddressPayload, updateAddressPayload };
