import { Messages } from '../types/messages/message.types';

const cartMessages: Messages = {
  productAdded: 'Product added to your cart.',
  productUpdated: 'Product updated.',
  productRemoved: 'Product removed from your cart.',
  cartCleared: 'Your cart has been cleared.',

  productNotFound: {
    msg: 'Product with code {code} not found.',
    replace: [{ from: 'code', to: 'code' }],
  },

  notEnoughStock: {
    msg: 'We do not have as many {name} as you want.',
    replace: [{ from: 'name', to: 'name' }],
  },
};

export default cartMessages;
