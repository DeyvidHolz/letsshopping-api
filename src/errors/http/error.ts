import { Response } from 'express';
import { ValidationRegex } from '../../validators/validator';

class HTTPError {
  public message!: string;
  public errors?: ValidationRegex[];

  private status: number;

  constructor(message: string, errors?: ValidationRegex[]) {
    this.message = message;
    this.errors = errors;
  }

  public send(res: Response) {
    return res.status(this.status).json({
      error: true,
      message: this.message,
      errors: this.errors,
    });
  }

  public setStatus(status: number): this {
    this.status = status;
    return this;
  }
}

type httpErrorData = {
  message: string;
  errors?: ValidationRegex[];
};

function httpError(data: httpErrorData): HTTPError {
  return new HTTPError(data.message, data.errors);
}

export { HTTPError, httpError, httpErrorData };
