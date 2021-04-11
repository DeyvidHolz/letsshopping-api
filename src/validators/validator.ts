type validationMessages = {
  field: string;
  message: string;
  tip?: string;
};

type validation = {
  hasErrors: boolean;
  errors: validationMessages[];
};

abstract class Validator {
  public validationErrors: validationMessages[];

  public validate(): validation {
    this.validationErrors = [];

    // Put your validation down here

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
}

export { validation, validationMessages, Validator };
