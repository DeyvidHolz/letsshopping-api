import { User } from '../entities/User.entity';

type CreateProductReviewDto = {
  title: string;
  rating: number;
  description?: string;
  product?: { id: string };
  user?: User;
};

type UpdateProductReviewDto = {
  id: number;
  title: string;
  rating: number;
  description?: string;
  product?: { id: string };
  user?: User;
};

export { CreateProductReviewDto, UpdateProductReviewDto };
