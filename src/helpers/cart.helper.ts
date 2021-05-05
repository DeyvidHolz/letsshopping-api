import { Cart } from '../entities/Cart.entity';
import { CartProduct } from '../entities/CartProduct.entity';

const calculateTotal = (cart: Cart) => {
  let total: number = 0;

  cart.cartProducts.forEach(
    (cp: CartProduct) => (total += cp.product.price * cp.quantity),
  );

  return total;
};

export { calculateTotal };
