import { HTTPError, httpErrorData } from './error';

class NotFound extends HTTPError {}

function notFound(data: httpErrorData): NotFound {
  return new NotFound(data.message, data.errors).setStatus(404);
}

export default notFound;
