import { Messages } from '../types/messages/message.types';

const addressMessages: Messages = {
  created: 'Address created.',
  updated: 'Address updated.',
  deleted: 'Address deleted.',
  invalidId: 'Invalid address ID.',
  invalidData: 'Invalid data.',
  duplicatedZipCode: 'You already have another address with this ZIP Code.',

  searchByIDNotFound: {
    msg: 'Address with ID {id} not found.',
    replace: ['id'],
  },
};

export default addressMessages;
