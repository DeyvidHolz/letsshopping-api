import { HTTPError, httpErrorData } from './error';

class InternalServerError extends HTTPError {}

function internalServerError(data: httpErrorData): InternalServerError {
  return new InternalServerError(data.message, data.errors).setStatus(500);
}

export default internalServerError;
