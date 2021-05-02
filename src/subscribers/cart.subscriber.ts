import {
  EntitySubscriberInterface,
  EventSubscriber,
  getConnection,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Cart } from '../entities/Cart.entity';
import { ProductInCart } from '../entities/ProductInCart.entity';

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<Cart> {
  /**
   * Indicates that this subscriber only listen to Cart events.
   */
  listenTo() {
    return Cart;
  }

  /*
   * Every time that the customer cart is updated, a ProductInCart (entity)
   * should be created or updated, so that the stock can stay always updated.
   */
  async beforeUpdate(event: UpdateEvent<Cart>) {
    const productInCartRepository = getConnection().getRepository(
      ProductInCart,
    );

    // Cart is empty, cleaning productsInCart
    if (!event.entity.cartProducts.length) {
      productInCartRepository.delete({ cart: { id: event.entity.id } });
      return;
    }

    const productCode: string = event.entity.cartProducts[0].product.code;
    const quantity: number = event.entity.cartProducts[0].quantity;

    // Cart is empty, a product is being added to the cart
    if (!event.entity.productsInCart.length) {
      const productInCart = new ProductInCart();
      productInCart.productCode = productCode;
      productInCart.cart = event.entity;
      productInCart.quantity = quantity;
      productInCartRepository.save(productInCart);
      return;
    }

    // Creating or updating product in cart
    const productInCart =
      (await productInCartRepository.findOne({ productCode })) ??
      new ProductInCart();

    productInCart.productCode = productCode;
    productInCart.cart = event.entity;
    productInCart.quantity = quantity;
    productInCartRepository.save(productInCart);
  }
}
