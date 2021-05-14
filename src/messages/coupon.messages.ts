import { Messages } from '../types/messages/message.types';

const couponMessages: Messages = {
  created: 'Coupon created.',
  updated: 'Coupon updated.',

  deleted: 'Coupon deleted.',

  duplicatedCode: 'The coupon code is already in use.',
  invalidData: 'Invalid data.',
  invalidId: 'Invalid coupon ID.',
  notFound: 'Coupon not found.',

  searchByIDNotFound: {
    msg: 'Coupon with ID {id} not found.',
    replace: ['id'],
  },
};

export default couponMessages;
