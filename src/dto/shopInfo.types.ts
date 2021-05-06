type createShopInfoDto = {
  name: string;
  phones: [{ value: string }];
  emails: [{ value: string }];
  socials: [{ name: string; value: string }];
};

type updateShopInfoDto = {
  id: number;
  name: string;
  phones: [{ value: string }];
  emails: [{ value: string }];
  socials: [{ name: string; value: string }];
};

export { createShopInfoDto, updateShopInfoDto };
