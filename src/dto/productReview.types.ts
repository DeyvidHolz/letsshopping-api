type createProductReviewDto = {
  title: string;
  rating: number;
  description?: string;
  product?: { id: string };
};

type updateProductReviewDto = {
  id: number;
  title: string;
  rating: number;
  description?: string;
  product?: { id: string };
};

export { createProductReviewDto, updateProductReviewDto };
