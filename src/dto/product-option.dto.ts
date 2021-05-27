import { CreateProductOptionValueDto } from './product-option-value.dto';

type CreateProductOptionDto = {
  name: string;
  values: CreateProductOptionValueDto[];
};

export { CreateProductOptionDto };
