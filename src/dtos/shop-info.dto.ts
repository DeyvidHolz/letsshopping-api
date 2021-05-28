import { CreateShopPhoneInfoDto } from './shop-phone.dto';
import { CreateShopEmailInfoDto } from './shop-email.dto';
import { CreateShopSocialInfoDto } from './shop-social.dto';

type CreateShopInfoDto = {
  name: string;
  phones?: CreateShopPhoneInfoDto[];
  emails?: CreateShopEmailInfoDto[];
  socials?: CreateShopSocialInfoDto[];
};

type UpdateShopInfoDto = {
  id: number;
  name: string;
  phones?: CreateShopPhoneInfoDto[];
  emails?: CreateShopEmailInfoDto[];
  socials?: CreateShopSocialInfoDto[];
};

export { CreateShopInfoDto, UpdateShopInfoDto };
