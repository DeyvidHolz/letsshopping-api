import { HTTPError, httpErrorData } from './error';

class Unauthorized extends HTTPError {}

function unauthorized(data: httpErrorData): Unauthorized {
  return new Unauthorized(data.message, data.errors).setStatus(401);
}

export default unauthorized;
