import { Messages } from '../types/messages/message.types';

const productReviewMessages: Messages = {
  created: 'Review created.',
  updated: 'Review updated.',
  deleted: 'Review deleted.',

  invalidData: 'Invalid data.',
  invalidId: 'Invalid review ID.',
  notFound: 'Review not found.',
  productNotFound: 'Product not found.',

  searchByIDNotFound: {
    msg: 'Review with ID {id} not found.',
    replace: [{ from: 'id', to: 'id' }],
  },
};

export default productReviewMessages;
