type CreateProductOptionValueDto = {
  value: string;
  price: number;
  mainImage?: string;
  isActive?: boolean;
  stock: number;
};

export { CreateProductOptionValueDto };
