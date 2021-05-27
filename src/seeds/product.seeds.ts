import { getConnection } from 'typeorm';
import { CreateProductDto } from '../dto/product.dto';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';

const seeds: CreateProductDto[] = [
  {
    code: 'EX0001',
    name: 'Grapes',
    shortDescription: 'Example of product',
    description: 'Long description',
    stock: 10,
    mainImage: 'grapes.jpg',
    isActive: true,
    price: 5,
    categories: [{ id: 1 }],
    options: [
      {
        name: 'Qty',
        values: [
          { price: 10, value: '2Kg', stock: 5 },
          { price: 45, value: '5Kg', stock: 25 },
        ],
      },
    ],
  },
  {
    code: 'EX0002',
    name: 'Mango',
    shortDescription: 'Example of product',
    description: 'Long description',
    stock: 7,
    mainImage: 'mango1.jpg',
    isActive: true,
    price: 15,
    categories: [{ id: 1 }],
    images: [
      { src: 'mango2.png', description: 'Wow, what a mango!' },
      { src: 'mango3.jpg' },
    ],
    options: [
      {
        name: 'Qty',
        values: [],
      },
    ],
  },
  {
    code: 'EX0003',
    name: 'Pineapple',
    shortDescription: 'Example of product',
    description: 'Long description',
    stock: 10,
    mainImage: 'pineapple1.jpg',
    isActive: true,
    price: 15,
    categories: [{ id: 1 }, { id: 2 }],
    images: [
      {
        src: 'pineapple2.jpg',
        description: '[Change my mind] Pineapples are Bananas without the B.',
      },
      { src: 'pineapple3.jpg' },
    ],
  },
  {
    code: 'EX0004',
    name: 'Pretzels',
    shortDescription: 'Example of product',
    description: 'Long description',
    stock: 3,
    mainImage: 'pretzels.jpg',
    isActive: true,
    price: 10,
    categories: [{ id: 2 }],
  },
  {
    code: 'EX0005',
    name: 'Popcorn',
    shortDescription: 'Example of product',
    description: 'Long description',
    stock: 2,
    mainImage: 'popcorn.jpg',
    isActive: true,
    price: 10,
    categories: [{ id: 2 }],
  },
];

export async function createProductSeeds() {
  const repository = getConnection().getRepository(Product);
  const qty = await repository.count();
  if (qty > 0) return;

  const products = repository.create(seeds as any);
  await repository.save(products);
}
