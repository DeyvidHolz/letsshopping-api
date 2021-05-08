import { CreateProductOptionValueDto } from './productOptionValue.dto';

type CreateProductOptionDto = {
  name: string;
  values: CreateProductOptionValueDto[];
};

export { CreateProductOptionDto };
