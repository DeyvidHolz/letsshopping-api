import { getConnection } from 'typeorm';
import { CreateCategoryDto } from '../dto/category.dto';
import { Category } from '../entities/Category.entity';

const seeds: CreateCategoryDto[] = [
  {
    name: 'Fruits',
    shortDescription: 'Some wholesome fruits to make your day better',
    description: 'Keep healthy :)',
  },
  { name: 'Foods', shortDescription: 'Every kind of food' },
  {
    name: 'Canned Foods',
    description:
      'Who knows when a zombie apocalypse will happen? So... just in case!',
  },
  { name: 'Others' },
];

export async function createCategorySeeds() {
  const repository = getConnection().getRepository(Category);
  const qty = await repository.count();
  if (qty > 0) return;

  const categories = repository.create(seeds as any);
  repository.save(categories);
}
