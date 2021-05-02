import { getConnection } from 'typeorm';
import { Cart } from '../entities/Cart.entity';
import { CartProduct } from '../entities/CartProduct.entity';
import { Product } from '../entities/Product.entity';

const hasStock = async (
  product: Product | string,
  quantity: number,
  cartId: number,
) => {
  if (typeof product === 'string')
    product = await getConnection()
      .getRepository(Product)
      .findOne({ code: product });

  let { currentlyAmountInCarts } = await getConnection()
    .getRepository(CartProduct)
    .createQueryBuilder()
    .select('SUM(quantity)', 'currentlyAmountInCarts')
    .where('CartProduct.cartId <> :cartId', { cartId })
    .getRawOne();

  currentlyAmountInCarts = Number(currentlyAmountInCarts);
  return product.stock >= currentlyAmountInCarts + quantity;
};

export { hasStock };
