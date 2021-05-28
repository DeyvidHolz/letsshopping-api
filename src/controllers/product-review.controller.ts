import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import internalServerError from '../errors/http/internal-server.error';
import notFound from '../errors/http/not-found.error';
import { ProductReview } from '../entities/product-review.entity';
import { getMessage } from '../helpers/messages.helper';
import productReviewMessages from '../messages/product-review.messages';
import { Product } from '../entities/product.entity';
import {
  CreateProductReviewDto,
  DeleteProductReviewDto,
  GetProductReviewDto,
  UpdateProductReviewDto,
} from '../dtos/product-review.dto';
import { Logger } from '../helpers/logger.helper';

class ProductReviewController {
  private static getRepository() {
    return getConnection().getRepository(ProductReview);
  }

  public static async create(req: Request, res: Response) {
    const productReviewRepository = ProductReviewController.getRepository();
    const dto: CreateProductReviewDto = req.dto;
    const productRepository = getConnection().getRepository(Product);
    const product = await productRepository.findOne({
      code: dto.product.code,
    });

    dto.user = req.user;
    dto.product = product;

    const productReview = productReviewRepository.create(dto as ProductReview);

    try {
      await productReviewRepository.save(productReview);
      return res.status(201).json({
        message: getMessage(productReviewMessages.created),
        productReview,
      });
    } catch (err) {
      Logger.critical(err);

      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }

  public static async get(req: Request, res: Response) {
    const productReviewRepository = ProductReviewController.getRepository();
    const dto: GetProductReviewDto = req.dto;

    const productReview = await productReviewRepository.findOne({
      where: {
        id: dto.id,
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
    const dto: UpdateProductReviewDto = req.dto;

    const productReview = productReviewRepository.create(
      dto as unknown as ProductReview,
    );

    try {
      await productReviewRepository.save(productReview);
      return res.status(200).json({
        message: getMessage(productReviewMessages.updated),
        productReview,
      });
    } catch (err) {
      Logger.critical(err);

      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }

  public static async delete(req: Request, res: Response) {
    const productReviewRepository = ProductReviewController.getRepository();
    const dto: DeleteProductReviewDto = req.dto;

    try {
      await productReviewRepository.delete(dto.id);
      return res
        .status(200)
        .json({ message: getMessage(productReviewMessages.deleted) });
    } catch (err) {
      Logger.critical(err);
      return internalServerError({
        message: 'An error occurred.',
      }).send(res);
    }
  }
}

export default ProductReviewController;
