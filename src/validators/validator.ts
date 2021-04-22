type validationMessages = {
  field: string;
  message: string;
  tip?: string;
};

type validation = {
  hasErrors: boolean;
  errors: validationMessages[];
};

type validationRegexArray = {
  regex: string;
  message?: string;
};

type validationRegex = {
  field: string;
  regex?: string;
  message?: string;
  validations?: validationRegexArray[];
};

abstract class Validator {
  public validationErrors: validationMessages[] | null = null;
  public data: any = {};
  protected validationRegex: validationRegex[];

  public validate(): validation {
    let childClass = this.child();

    this.validationErrors = [];

    if (childClass) {
      this.validationRegex.forEach((validationRegex: validationRegex) => {
        if (Array.isArray(validationRegex.validations)) {
          const value = childClass.data[validationRegex.field];
          validationRegex.validations.forEach((v) => {
            const regex = new RegExp(v.regex);

            if (!value.match(regex)) {
              this.addError(
                validationRegex.field,
                v.message ??
                  validationRegex.message ??
                  `Invalid value for ${validationRegex.field}.`,
              );
            }
          });
        } else {
          const value = childClass.data[validationRegex.field];
          const regex = new RegExp(validationRegex.regex);

          if (!value.match(regex)) {
            this.addError(
              validationRegex.field,
              validationRegex.message ??
                `Invalid value for ${validationRegex.field}.`,
            );
          }
        }
      });
    }

    return {
      hasErrors: !!this.validationErrors.length,
      errors: this.validationErrors,
    };
  }

  public hasErrors(): boolean {
    if (this.validationErrors === null) this.validate();
    return !!this.validationErrors.length;
  }

  public first(): validationMessages | null {
    return this.validationErrors ? this.validationErrors[0] : null;
  }

  public addError(fieldName: string, message: string = 'Invalid value'): this {
    this.validationErrors.push({
      field: fieldName,
      message,
    });

    return this;
  }

  public child() {
    return this;
  }
}

export { validation, validationMessages, Validator, validationRegex };
