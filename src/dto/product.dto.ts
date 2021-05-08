import { CreateOptionDto } from './productOption.dto';

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
  options: CreateOptionDto[];
};

type UpdateProductDto = {
  id: number;
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
  options: CreateOptionDto[];
};

export { CreateProductDto, UpdateProductDto };
