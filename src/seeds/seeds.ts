import 'colors';
import dotenv from 'dotenv';

import { createCategorySeeds } from './category.seeds';
import { createPermissionGroupSeeds } from './permission-groups.seeds';
import { createProductSeeds } from './product.seeds';
import { createShopInfoSeeds } from './shop-info.seeds';
import { createUserSeeds } from './user.seeds';

dotenv.config();

export async function createSeeds() {
  const runSeeds = process.env.RUN_SEEDS === 'true';
  if (runSeeds) {
    console.log('Creating seeds...'.blue);
    await createShopInfoSeeds();
    await createPermissionGroupSeeds();
    await createUserSeeds();
    await createCategorySeeds();
    await createProductSeeds();
    console.log('All seeds created'.blue);
  }
}
