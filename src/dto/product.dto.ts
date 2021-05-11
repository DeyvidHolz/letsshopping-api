import { CreateProductOptionDto } from './productOption.dto';

type CreateProductDto = {
  code: string;
  name: string;
  shortDescription: string;
  description: string;
  mainImage: string;
  isActive: boolean;
  stock?: number;
  price: number;
  weight?: number;
  width?: number;
  height?: number;
  categories: number[];
  images: [{ src: string; description?: string }];
  options: CreateProductOptionDto[];
};

type UpdateProductDto = {
  // Product code is unique. Use 'code' instead of id.
  id?: number;
  code: string;
  name: string;
  shortDescription: string;
  description: string;
  mainImage: string;
  isActive: boolean;
  stock?: number;
  price: number;
  weight?: number;
  width?: number;
  height?: number;
  categories: number[];
  images: [{ src: string; description?: string }];
  options: CreateProductOptionDto[];
};

export { CreateProductDto, UpdateProductDto };
