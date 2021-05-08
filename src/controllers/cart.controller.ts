import { getConnection } from 'typeorm';
import { Request, Response } from 'express';

import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import notFound from '../errors/http/notFound.error';
import cartMessages from '../messages/cart.messages';
import { Cart } from '../entities/Cart.entity';
import { Product } from '../entities/Product.entity';
import { CartProduct } from '../entities/CartProduct.entity';
import { calculateTotal } from '../helpers/cart.helper';
import { getMessage } from '../helpers/messages.helper';
import { hasStock } from '../helpers/stock.helper';

class CartController {
  private static getRepository() {
    return getConnection().getRepository(Cart);
  }

  public static async get(req: Request, res: Response) {
    const cartRepository = CartController.getRepository();

    const cart = await cartRepository.findOne({
      where: { user: { id: req.user.id } },
    });

    return res.json(cart);
  }

  public static async addProduct(req: Request, res: Response) {
    const cartRepository = CartController.getRepository();
    const productRepository = getConnection().getRepository(Product);
    const cartProductRepository = getConnection().getRepository(CartProduct);

    const productCode: string = req.params.code;
    const quantityConverted = Number(req.body.quantity);
    const productQuantity: number = isNaN(quantityConverted)
      ? 1
      : quantityConverted;

    const cart = await cartRepository.findOne({
      where: { user: { id: req.user.id } },
    });

    const currentCartProduct = cart.cartProducts.find((cp) => {
      return cp.product.code === productCode;
    });

    if (currentCartProduct) {
      currentCartProduct.quantity += productQuantity;

      // Checking stock
      const noStock: boolean = !(await hasStock(
        currentCartProduct.product,
        currentCartProduct.quantity,
        cart.id,
      ));

      if (noStock) {
        return unprocessableEntity({
          message: getMessage(
            cartMessages.notEnoughStock,
            currentCartProduct.product,
          ),
        }).send(res);
      }

      await cartProductRepository.save(currentCartProduct);
    } else {
      const product = await productRepository.findOne({ code: productCode });

      if (!product)
        return notFound({
          message: getMessage(cartMessages.productNotFound, {
            code: productCode,
          }),
        }).send(res);

      const cartProduct = new CartProduct();
      cartProduct.quantity = productQuantity || 1;
      cartProduct.product = product;
      cartProduct.cart = cart;

      // Checking stock
      const noStock: boolean = !(await hasStock(
        product,
        productQuantity,
        cart.id,
      ));

      if (noStock) {
        return unprocessableEntity({
          message: getMessage(cartMessages.notEnoughStock, product),
        }).send(res);
      }

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

    const productCode: string = req.params.code;

    const cart = await cartRepository.findOne({
      where: { user: { id: req.user.id } },
    });

    const currentCartProductIndex = cart.cartProducts.findIndex(
      (cp) => cp.product.code === productCode,
    );

    if (currentCartProductIndex === -1)
      return notFound({
        message: getMessage(cartMessages.productNotFound, {
          code: productCode,
        }),
      }).send(res);

    cart.cartProducts.splice(currentCartProductIndex, 1);
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
    const cartProductRepository = getConnection().getRepository(CartProduct);

    const productCode: string = req.params.code;
    const productQuantity = Number(req.body.quantity);

    const cart = await cartRepository.findOne({
      where: { user: { id: req.user.id } },
    });

    let index = null;
    const currentCartProduct = cart.cartProducts.find((cp, i) => {
      index = i;
      return cp.product.code === productCode;
    });

    if (!req.body.quantity) {
      return unprocessableEntity({ message: 'Quantity is required.' }).send(
        res,
      );
    }

    if (isNaN(productQuantity) || productQuantity < 1)
      return unprocessableEntity({ message: 'Invalid quantity.' }).send(res);

    if (!currentCartProduct) {
      return notFound({
        message: getMessage(cartMessages.productNotFound, {
          code: productCode,
        }),
      }).send(res);
    }

    const noStock: boolean = !(await hasStock(
      currentCartProduct.product.code,
      productQuantity,
      cart.id,
    ));

    if (noStock) {
      return unprocessableEntity({
        message: getMessage(
          cartMessages.notEnoughStock,
          currentCartProduct.product,
        ),
      }).send(res);
    }

    if (currentCartProduct) {
      currentCartProduct.quantity = productQuantity;
      cart.cartProducts[index].quantity = productQuantity;
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
    const cart = await cartRepository.findOne({ user: { id: req.user.id } });

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
