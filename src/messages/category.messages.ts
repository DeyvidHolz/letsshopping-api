import { Messages } from '../types/messages/message.types';

const categoryMessages: Messages = {
  created: 'Category created.',
  updated: 'Category updated.',

  deleted: {
    msg: 'Category with ID {id} deleted.',
    replace: [{ from: 'id', to: 'id' }],
  },

  invalidData: 'Invalid data.',

  searchByIDNotFound: {
    msg: 'Category with ID {id} not found.',
    replace: [{ from: 'id', to: 'id' }],
  },
};

export default categoryMessages;
