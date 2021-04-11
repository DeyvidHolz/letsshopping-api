import validator from "validator";

import { User } from "../entity/User";
import { validation, validationMessages, Validator } from "./validator";

export default class UserValidator extends Validator {
  public user: User;
  public validationErrors: validationMessages[];

  constructor(user: User) {
    super();
    this.user = user;
  }

  public validate(): validation {
    this.validationErrors = [];

    if (!this.user.username.match(/[\w\.]+/g)) {
      this.validationErrors.push({
        field: "username",
        message: "Invalid username.",
      });
    }

    if (!(this.user.password.length > 5 && this.user.password.length < 100)) {
      this.validationErrors.push({
        field: "passwrd",
        message: "Invalid password.",
        tip: "Password length must be between 6-99 characters.",
      });
    }

    if (!validator.isAlpha(this.user.firstName)) {
      this.validationErrors.push({
        field: "firstName",
        message: "Invalid first name.",
      });
    }

    if (!this.user.lastName.match(/^[A-Za-z]+$/)) {
      this.validationErrors.push({
        field: "lastName",
        message: "Invalid last name.",
      });
    }

    if (!validator.isEmail(this.user.email)) {
      this.validationErrors.push({ field: "email", message: "Invalid email." });
    }

    if (!validator.isDate(this.user.birthDate)) {
      this.validationErrors.push({
        field: "birthDate",
        message: "Invalid birth date.",
        tip: "Birth date format must be YYYY-MM-DD.",
      });
    }

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }
}
