type createShopInfoPayload = {
  name: string;
  phones: [{ value: string }];
  emails: [{ value: string }];
  socials: [{ name: string; value: string }];
};

type updateShopInfoPayload = {
  id: number;
  name: string;
  phones: [{ value: string }];
  emails: [{ value: string }];
  socials: [{ name: string; value: string }];
};

export { createShopInfoPayload, updateShopInfoPayload };
