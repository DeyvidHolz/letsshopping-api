import { User } from '../entities/user.entity';

type CreateProductReviewDto = {
  title: string;
  rating: number;
  description?: string;
  product?: { id: string; code: string };
  user?: User;
};

type UpdateProductReviewDto = {
  id: number;
  title: string;
  rating: number;
  description?: string;
  product?: { id: string; code: string };
  user?: User;
};

type GetProductReviewDto = {
  id: number;
};

type DeleteProductReviewDto = {
  id: number;
};

export {
  CreateProductReviewDto,
  UpdateProductReviewDto,
  GetProductReviewDto,
  DeleteProductReviewDto,
};
