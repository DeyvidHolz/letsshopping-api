import 'colors';
import dotenv from 'dotenv';

import { createCategorySeeds } from './category.seeds';
import { createProductSeeds } from './product.seeds';

dotenv.config();

export async function createSeeds() {
  const runSeeds = process.env.RUN_SEEDS === 'true';
  if (runSeeds) {
    console.log('Creating seeds...'.blue);
    await createCategorySeeds();
    await createProductSeeds();
    console.log('All seeds created'.blue);
  }
}
