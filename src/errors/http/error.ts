import { Response } from 'express';
import { validationMessages } from '../../validators/validator';

class HTTPError {
  public message!: string;
  public errors?: validationMessages[];

  private status: number;

  constructor(message: string, errors?: validationMessages[]) {
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
  errors?: validationMessages[];
};

function httpError(data: httpErrorData): HTTPError {
  return new HTTPError(data.message, data.errors);
}

export { HTTPError, httpError, httpErrorData };
