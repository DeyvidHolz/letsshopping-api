type ValidationMessages = {
  field: string;
  message: string;
  tip?: string;
};

type Validation = {
  hasErrors: boolean;
  errors: ValidationMessages[];
};

type ValidationRegexArray = {
  regex: string;
  message?: string;
};

type ValidationRegex = {
  field: string;
  regex?: string;
  required?: boolean;
  requiredOnUpdate?: boolean;
  message?: string;
  validations?: ValidationRegexArray[];
};

abstract class Validator {
  public validationErrors: ValidationMessages[] | null = null;
  public data: any = {};
  public updating: boolean = false;

  protected validationRegex: ValidationRegex[];

  public validate(): Validation {
    this.validationErrors = [];

    this.validationRegex.forEach((validationRegex: ValidationRegex) => {
      this.validateField(validationRegex);
    });

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }

  public hasErrors(): boolean {
    if (this.validationErrors === null) this.validate();
    return !!this.validationErrors.length;
  }

  public first(): string | null {
    return this.validationErrors ? this.validationErrors[0].message : null;
  }

  public addError(fieldName: string, message: string = 'Invalid value'): this {
    this.validationErrors.push({
      field: fieldName,
      message,
    });

    return this;
  }

  protected validateField(validationRegex: ValidationRegex): void {
    const isArray = Array.isArray(validationRegex.validations);
    const value = this.data[validationRegex.field] ?? '';

    validationRegex.required =
      validationRegex.required === undefined ? true : validationRegex.required;

    validationRegex.requiredOnUpdate =
      validationRegex.required === undefined
        ? false
        : validationRegex.requiredOnUpdate;

    const shouldNotValidateField =
      !validationRegex.requiredOnUpdate &&
      this.data[validationRegex.field] === undefined;

    if (this.updating && shouldNotValidateField) {
      return;
    }

    if (isArray) {
      validationRegex.validations.forEach((v) => {
        if (validationRegex.required) {
          if (value === '' || value === null || value === undefined) {
            this.addError(
              validationRegex.field,
              validationRegex.message ??
                `The field ${validationRegex.field} is required.`,
            );
          }

          const regex = new RegExp(v.regex);

          if (!String(value).match(regex)) {
            this.addError(
              validationRegex.field,
              v.message ??
                validationRegex.message ??
                `Invalid value for ${validationRegex.field}.`,
            );
          }
        }
      });

      return;
    }

    const regex = new RegExp(validationRegex.regex);
    if (!String(value).match(regex)) {
      this.addError(
        validationRegex.field,
        validationRegex.message ??
          `Invalid value for ${validationRegex.field}.`,
      );
    }
  }
}

export { Validation, ValidationMessages, Validator, ValidationRegex };
