type CreateProductReviewDto = {
  title: string;
  rating: number;
  description?: string;
  product?: { id: string };
};

type UpdateProductReviewDto = {
  id: number;
  title: string;
  rating: number;
  description?: string;
  product?: { id: string };
};

export { CreateProductReviewDto, UpdateProductReviewDto };
