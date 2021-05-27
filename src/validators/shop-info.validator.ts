import { CreateShopInfoDto, UpdateShopInfoDto } from '../dto/shop-info.dto';
import ShopPhoneValidator from './shop-phone.validator';
import shopInfoValidationRegex from './validationRegex/shop-info.validation-regex';

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
    shopInfoDto: CreateShopInfoDto | UpdateShopInfoDto,
    updating: boolean = false,
  ) {
    super();
    this.updating = updating;
    this.data = shopInfoDto;
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
