import { getConnection } from 'typeorm';
import { Request, Response } from 'express';

import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import internalServerError from '../errors/http/internalServer.error';
import notFound from '../errors/http/notFound.error';
import { ProductReview } from '../entities/ProductReview.entity';
import { getMessage } from '../helpers/messages.helper';
import productReviewMessages from '../messages/productReview.messages';
import { Product } from '../entities/Product.entity';

class ProductReviewController {
  private static getRepository() {
    return getConnection().getRepository(ProductReview);
  }

  public static async create(req: Request, res: Response) {
    const productReviewRepository = ProductReviewController.getRepository();
    const productRepository = getConnection().getRepository(Product);
    req.dto.user = req.user;

    const product = await productRepository.findOne({
      code: req.dto.product.code,
    });
    req.dto.product = product;

    const productReview = productReviewRepository.create(
      req.dto as ProductReview,
    );

    try {
      await productReviewRepository.save(productReview);
      return res.status(201).json({
        message: getMessage(productReviewMessages.created),
        productReview,
      });
    } catch (err) {
      console.log(err);

      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }

  public static async get(req: Request, res: Response) {
    const productReviewRepository = ProductReviewController.getRepository();
    const productReviewId: number = Number(req.params.id);

    const productReview = await productReviewRepository.findOne({
      where: {
        id: productReviewId,
        user: { id: req.user.id },
      },
      relations: ['product'],
    });

    if (!productReview) {
      return notFound({
        message: getMessage(productReviewMessages.notFound),
      }).send(res);
    }

    return res.status(200).json(productReview);
  }

  public static async getAll(req: Request, res: Response) {
    const productReviewRepository = ProductReviewController.getRepository();

    const productReviews = await productReviewRepository.find({
      where: { user: { id: req.user.id } },
      relations: ['product'],
    });

    return res.status(200).json(productReviews);
  }

  public static async update(req: Request, res: Response) {
    const productReviewRepository = ProductReviewController.getRepository();

    const productReview = productReviewRepository.create(
      req.dto as ProductReview,
    );

    try {
      await productReviewRepository.save(productReview);
      return res.status(200).json({
        message: getMessage(productReviewMessages.updated),
        productReview,
      });
    } catch (err) {
      console.log(err);

      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }

  public static async delete(req: Request, res: Response) {
    const productReviewRepository = ProductReviewController.getRepository();
    try {
      await productReviewRepository.delete(req.params.id);
      return res
        .status(200)
        .json({ message: getMessage(productReviewMessages.deleted) });
    } catch (err) {
      console.log(err);
      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }
}

export default ProductReviewController;
