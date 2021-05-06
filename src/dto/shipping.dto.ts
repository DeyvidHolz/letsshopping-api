type createShippingDto = {
  order: { id: number };
  status: number;
  events: [
    {
      name: string;
      description: string;
      date: string;
    },
  ];
};

type updateShippingDto = {
  id: number;
  status: number;
  events: [
    {
      name: string;
      description: string;
      date: string;
    },
  ];
};

export { createShippingDto, updateShippingDto };
