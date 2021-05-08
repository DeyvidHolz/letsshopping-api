import { CreateShopInfoDto, UpdateShopInfoDto } from '../dto/shopInfo.dto';
import ShopPhoneValidator from './shopPhone.validator';
import shopInfoValidationRegex from './validationRegex/shopInfo.validationRegex';

import {
  Validation,
  ValidationMessages,
  Validator,
  ValidationRegex,
} from './validator';

export default class ShopInfoValidator extends Validator {
  public data: CreateShopInfoDto | UpdateShopInfoDto;
  public validationErrors: ValidationMessages[] | null = null;

  protected validationRegex: ValidationRegex[] = shopInfoValidationRegex;

  constructor(
    shopInfo: CreateShopInfoDto | UpdateShopInfoDto,
    updating: boolean = false,
  ) {
    super();
    this.updating = updating;
    this.data = shopInfo;
  }

  public validate(): Validation {
    super.validate();

    // Implementing ShopPhone validations
    if (this.data.phones && this.data.phones.length) {
      this.data.phones.forEach((phone, index) => {
        const productOptionValidation = new ShopPhoneValidator(phone);
        if (productOptionValidation.hasErrors()) {
          this.addError(`phones[${index}]`, productOptionValidation.first());
          return;
        }
      });
    }

    // Implementing ShopEmail validations
    if (this.data.emails && this.data.emails.length) {
      this.data.emails.forEach((email, index) => {
        const productOptionValidation = new ShopPhoneValidator(email);
        if (productOptionValidation.hasErrors()) {
          this.addError(`emails[${index}]`, productOptionValidation.first());
          return;
        }
      });
    }

    // Implementing ShopEmail validations
    if (this.data.socials && this.data.socials.length) {
      this.data.socials.forEach((social, index) => {
        const productOptionValidation = new ShopPhoneValidator(social);
        if (productOptionValidation.hasErrors()) {
          this.addError(`socials[${index}]`, productOptionValidation.first());
          return;
        }
      });
    }

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
