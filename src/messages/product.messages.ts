import { messages } from '../types/messages/message.types';

const productMessages: messages = {
  created: 'Product created.',
  updated: 'Product updated.',

  deleted: {
    msg: 'Product with ID or Code {id} deleted.',
    replace: [{ from: 'id', to: 'id' }],
  },

  invalidData: 'Invalid data.',
  invalidSearchCriteria: 'Invalid search criteria.',
  alreadyExists: 'This code is already in use.',
  alreadyDeleted: 'Invalid token or product already deleted.',
  notFound: {
    msg: 'Product with {code} not found.',
    replace: [{ from: 'code', to: 'code' }],
  },

  searchByIDNotFound: {
    msg: 'Product with ID or Code {id} not found.',
    replace: [{ from: 'id', to: 'id' }],
  },
};

export default productMessages;
