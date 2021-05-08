import { CreateShopPhoneInfoDto } from './shopPhone.dto';
import { CreateShopEmailInfoDto } from './shopEmail.dto';
import { CreateShopSocialInfoDto } from './shopSocial.dto';

type CreateShopInfoDto = {
  name: string;
  phones: CreateShopPhoneInfoDto[];
  emails: CreateShopEmailInfoDto[];
  socials: CreateShopSocialInfoDto[];
};

type UpdateShopInfoDto = {
  id: number;
  name: string;
  phones: CreateShopPhoneInfoDto[];
  emails: CreateShopEmailInfoDto[];
  socials: CreateShopSocialInfoDto[];
};

export { CreateShopInfoDto, UpdateShopInfoDto };
