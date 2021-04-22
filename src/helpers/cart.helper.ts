import { Cart } from '../entities/Cart.entity';

const calculateTotal = (cart: Cart) => {
  let total = 0;

  if (cart.cartProducts) {
    cart.cartProducts.reduce((current, next) => {
      total +=
        current.product.price * current.quantity +
        next.product.price * current.quantity;
      return current;
    }, cart.cartProducts[0]);
  }

  return total;
};

export { calculateTotal };
