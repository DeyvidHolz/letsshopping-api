import { option } from '../entities/productOptionIn.types';

type createProductPayload = {
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

type updateProductPayload = {
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

export { createProductPayload, updateProductPayload };
