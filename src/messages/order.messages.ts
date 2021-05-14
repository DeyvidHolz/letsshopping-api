import { Messages } from '../types/messages/message.types';

const orderMessages: Messages = {
  created: 'Order created.',
  updated: 'Order updated.',
  duplicatedCode: 'The order code is already in use.',
  invalidShippingAddress: 'Shipping address ID is required.',

  shippingAddressNotFound: 'Shipping address not found',
  noItemsInCart: 'You cannot create an order without items in your cart.',
  addressRequired: 'Address is required.',
  invalidData: 'Invalid data.',
  invalidId: 'Invalid order ID.',

  notFound: 'Order not found.',
  noProductsFound: 'No products found.',

  searchByIDNotFound: {
    msg: 'Order with ID {id} not found.',
    replace: [{ from: 'id', to: 'id' }],
  },
};

export default orderMessages;
