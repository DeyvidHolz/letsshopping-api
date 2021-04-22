type createProductReviewPayload = {
  title: string;
  rating: number;
  description?: string;
  product?: { id: string };
};

type updateProductReviewPayload = {
  id: number;
  title: string;
  rating: number;
  description?: string;
  product?: { id: string };
};

export { createProductReviewPayload, updateProductReviewPayload };
