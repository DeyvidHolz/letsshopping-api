type CreateShopInfoDto = {
  name: string;
  phones: [{ value: string }];
  emails: [{ value: string }];
  socials: [{ name: string; value: string }];
};

type UpdateShopInfoDto = {
  id: number;
  name: string;
  phones: [{ value: string }];
  emails: [{ value: string }];
  socials: [{ name: string; value: string }];
};

export { CreateShopInfoDto, UpdateShopInfoDto };
