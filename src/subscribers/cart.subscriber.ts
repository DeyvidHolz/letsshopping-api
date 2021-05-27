import {
  EntitySubscriberInterface,
  EventSubscriber,
  getConnection,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartProduct } from '../entities/cart-product.entity';
import { Product } from '../entities/product.entity';

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<Cart> {
  /**
   * Indicates that this subscriber only listen to Cart events.
   */
  listenTo() {
    return Cart;
  }

  /*
   * Every time that the customer cart is updated, a CartProduct (entity)
   * should be created or updated, so that the stock can stay always updated.
   */
  async beforeUpdate(event: UpdateEvent<Cart>) {
    const cartProductRepository = getConnection().getRepository(CartProduct);

    let product: Product | null = null;
    let quantity: number | null = null;

    // Table is being created
    if (!event.entity.cartProducts) return;

    // Cart is empty
    if (!event.entity.cartProducts.length) {
      // A product is being added to the cart
      if (event.entity.cartProducts[0]) {
        product = event.entity.cartProducts[0].product;
        quantity = event.entity.cartProducts[0].quantity;

        const cartProduct = new CartProduct();
        cartProduct.product = product;
        cartProduct.quantity = quantity;
        cartProduct.cart = event.entity;
        return await cartProductRepository.save(cartProduct);
      }

      // Cart is being cleaned
      return await cartProductRepository.delete({
        cart: { id: event.entity.id },
      });
    }

    product = event.entity.cartProducts[0].product;
    quantity = event.entity.cartProducts[0].quantity;

    // Creating or updating product in cart
    const cartProduct =
      (await cartProductRepository.findOne({
        cart: { id: event.entity.id },
        product: { id: product.id },
      })) ?? new CartProduct();

    cartProduct.product = product;
    cartProduct.quantity = quantity;
    cartProduct.cart = event.entity;
    return await cartProductRepository.save(cartProduct);
  }
}
