import { getConnection } from 'typeorm';
import { Request, Response } from 'express';

import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import notFound from '../errors/http/notFound.error';
import { Cart } from '../entities/Cart.entity';
import { getUserData } from '../helpers/auth.helper';
import { Product } from '../entities/Product.entity';
import { CartProduct } from '../entities/CartProduct.entity';
import { calculateTotal } from '../helpers/cart.helper';
import { getMessage } from '../helpers/messages.helper';
import cartMessages from '../messages/cart.messages';

class CartController {
  private static getRepository() {
    return getConnection().getRepository(Cart);
  }

  public static async get(req: Request, res: Response) {
    const cartRepository = CartController.getRepository();
    const userData = getUserData(req.headers.authorization);

    const cart = await cartRepository.findOne({
      where: { user: { id: userData.id } },
    });

    return res.json(cart);
  }

  public static async addProduct(req: Request, res: Response) {
    const cartRepository = CartController.getRepository();
    const productRepository = getConnection().getRepository(Product);
    const cartProductRepository = getConnection().getRepository(CartProduct);
    const userData = getUserData(req.headers.authorization);
    const productId: string = req.body.id;

    const cart = await cartRepository.findOne({
      where: { user: { id: userData.id } },
    });

    const currentCartProduct = cart.cartProducts.find((cp) => {
      return cp.product.id === productId;
    });

    // @TODO: check stock -> req.body.quantity

    if (currentCartProduct) {
      currentCartProduct.quantity += 1;
      cartProductRepository.save(currentCartProduct);
    } else {
      const product = await productRepository.findOne(productId);
      const cartProduct = new CartProduct();
      cartProduct.quantity = req.body.quantity || 1;
      cartProduct.product = product;
      cartProduct.cart = cart;
      await cartProductRepository.save(cartProduct);

      cart.cartProducts = [...cart.cartProducts, cartProduct];
    }

    cart.total = calculateTotal(cart);

    await cartRepository.save(cart);
    const updatedCart = await cartRepository.findOne({ id: cart.id });

    return res.json({
      message: getMessage(cartMessages.productAdded),
      cart: updatedCart,
    });
  }

  public static async removeProduct(req: Request, res: Response) {
    const cartRepository = CartController.getRepository();
    const cartProductRepository = getConnection().getRepository(CartProduct);
    const userData = getUserData(req.headers.authorization);
    const productId: string = req.body.id;

    const cart = await cartRepository.findOne({
      where: { user: { id: userData.id } },
    });

    const currentCartProduct = cart.cartProducts.find(
      (cp) => cp.product.id === productId,
    );

    if (currentCartProduct) {
      cartProductRepository.remove(currentCartProduct);
    }

    cart.total = calculateTotal(cart);
    await cartRepository.save(cart);

    const updatedCart = await cartRepository.findOne({ id: cart.id });

    return res.json({
      message: getMessage(cartMessages.productRemoved),
      cart: updatedCart,
    });
  }

  public static async updateProduct(req: Request, res: Response) {
    const cartRepository = CartController.getRepository();
    const productRepository = getConnection().getRepository(Product);
    const cartProductRepository = getConnection().getRepository(CartProduct);
    const userData = getUserData(req.headers.authorization);
    const productId: string = req.body.id;

    const cart = await cartRepository.findOne({
      where: { user: { id: userData.id } },
    });

    let index = null;
    const currentCartProduct = cart.cartProducts.find((cp, i) => {
      index = i;
      return cp.product.id === productId;
    });

    // @TODO: check stock -> req.body.quantity

    if (!req.body.quantity) {
      return unprocessableEntity({ message: 'Quantity is required.' }).send(
        res,
      );
    }

    if (req.body.quantity < 1)
      return unprocessableEntity({ message: 'Invalid quantity.' }).send(res);

    if (!currentCartProduct) {
      return notFound({
        message: `The product with ID ${productId} is not in your cart.`,
      }).send(res);
    }

    if (currentCartProduct) {
      currentCartProduct.quantity = req.body.quantity;
      cart.cartProducts[index].quantity = req.body.quantity;
      cartProductRepository.save(currentCartProduct);
    }

    cart.total = calculateTotal(cart);
    await cartRepository.save(cart);

    return res.json({
      message: getMessage(cartMessages.productUpdated),
      cart,
    });
  }

  public static async clearCart(req: Request, res: Response) {
    const cartRepository = CartController.getRepository();
    const cartProductRepository = getConnection().getRepository(CartProduct);
    const userData = getUserData(req.headers.authorization);
    const cart = await cartRepository.findOne({ user: { id: userData.id } });

    if (cart.cartProducts && cart.cartProducts.length) {
      await cartProductRepository.remove(cart.cartProducts);
    }

    cart.total = 0;
    cart.cartProducts = [];
    await cartRepository.save(cart);

    return res.json({
      message: getMessage(cartMessages.cartCleared),
      cart,
    });
  }
}

export default CartController;
