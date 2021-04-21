import { getConnection } from 'typeorm';
import { Request, Response } from 'express';
import decode from 'jwt-decode';

import unprocessableEntity from '../errors/http/unprocessableEntity.error';
import internalServerError from '../errors/http/internalServer.error';
import notFound from '../errors/http/notFound.error';
import unauthorized from '../errors/http/unauthorized';
import { ProductReview } from '../entity/ProductReview';

class ProductReviewController {
  private static getRepository() {
    return getConnection().getRepository(ProductReview);
  }

  public static async create(req: Request, res: Response) {
    const productReviewRepository = ProductReviewController.getRepository();

    if (!req.body.product_id) {
      return unprocessableEntity({
        message: 'Invalid product ID.',
      }).send(res);
    }

    req.body.product = { id: req.body.product_id };

    const productReview = productReviewRepository.create(
      req.body as ProductReview,
    );

    try {
      await productReviewRepository.save(productReview);
      return res
        .status(201)
        .json({ message: 'Review created.', productReview });
    } catch (err) {
      console.log(err);

      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }

  public static async get(req: Request, res: Response) {
    const productReviewRepository = ProductReviewController.getRepository();
    const productReview = await productReviewRepository.findOne(req.params.id, {
      relations: ['product'],
    });

    if (!productReview) {
      return notFound({
        message: 'Review not found.',
      }).send(res);
    }

    return res.status(200).json(productReview);
  }

  public static async getAll(req: Request, res: Response) {
    const productReviewRepository = ProductReviewController.getRepository();

    const productReviews = await productReviewRepository.find({
      relations: ['product'],
    });
    return res.status(200).json(productReviews);
  }

  public static async update(req: Request, res: Response) {
    const productReviewRepository = ProductReviewController.getRepository();
    const productReview = productReviewRepository.create(
      req.body as ProductReview,
    );

    if (!req.body.id) {
      return unprocessableEntity({
        message: 'Invalid review ID.',
      }).send(res);
    }

    try {
      await productReviewRepository.save(productReview);
      return res
        .status(201)
        .json({ message: 'Review updated.', productReview });
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
      return res.status(200).json({ message: 'Review deleted.' });
    } catch (err) {
      console.log(err);
      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }
}

export default ProductReviewController;
