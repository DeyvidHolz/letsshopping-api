type CreateShippingDto = {
  order: { id: number };
  status: number;
  events: {
    name: string;
    description: string;
    date: string;
  }[];
};

type UpdateShippingDto = {
  id: number;
  status: number;
  events: {
    name: string;
    description: string;
    date: string;
  }[];
};

type GetShippingDto = {
  id: number;
};

export { CreateShippingDto, UpdateShippingDto, GetShippingDto };
