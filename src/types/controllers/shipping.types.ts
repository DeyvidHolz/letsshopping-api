type createShippingPayload = {
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

type updateShippingPayload = {
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

export { createShippingPayload, updateShippingPayload };
