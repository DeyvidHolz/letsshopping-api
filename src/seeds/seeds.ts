import 'colors';
import dotenv from 'dotenv';

// import { createCategorySeeds } from './category.seeds';

dotenv.config();

export async function createSeeds() {
  const runSeeds = process.env.RUN_SEEDS === 'true';
  if (runSeeds) {
    console.log('Creating seeds...'.blue);
    // createCategorySeeds();
    console.log('All seeds created'.blue);
  }
}
