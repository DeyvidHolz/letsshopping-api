import { option } from '../entities/productOptionIn.types';

type createProductDto = {
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
  options: option;
};

type updateProductDto = {
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
  options: option;
};

export { createProductDto, updateProductDto };
