import { HTTPError, httpErrorData } from "./error";

class UnprocessableEntity extends HTTPError
{

}

function unprocessableEntity (data: httpErrorData) : UnprocessableEntity
{
  return new UnprocessableEntity(data.message, data.errors)
    .setStatus(422);
}

export default unprocessableEntity;
