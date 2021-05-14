import { Messages } from '../types/messages/message.types';

const productMessages: Messages = {
  created: 'Product created.',
  updated: 'Product updated.',

  deleted: {
    msg: 'Product with code {code} deleted.',
    replace: [{ from: 'code', to: 'code' }],
  },

  invalidData: 'Invalid data.',
  invalidSearchCriteria: 'Invalid search criteria.',
  alreadyExists: 'This code is already in use.',
  alreadyDeleted: 'Invalid token or product already deleted.',
  notFound: {
    msg: 'Product with {code} not found.',
    replace: [{ from: 'code', to: 'code' }],
  },

  searchByCodeNotFound: {
    msg: 'Product with code {code} not found.',
    replace: [{ from: 'code', to: 'code' }],
  },
};

export default productMessages;
