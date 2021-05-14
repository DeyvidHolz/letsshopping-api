import { Messages } from '../types/messages/message.types';

const shippingMessages: Messages = {
  created: 'Shipping created.',
  updated: 'Shipping updated.',
  deleted: 'Shipping deleted.',
  invalidData: 'Invalid data.',
  invalidId: 'Invalid ID.',

  invalidOrderId: 'Invalid order ID.',
  notFound: 'Shipping not found.',

  orderNotFound: {
    msg: 'Order with ID {id} not found.',
    replace: ['id'],
  },

  searchByIDNotFound: {
    msg: 'Shipping with ID {id} not found.',
    replace: ['id'],
  },
};

export default shippingMessages;
