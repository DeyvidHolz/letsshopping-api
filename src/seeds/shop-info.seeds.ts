import dotenv from 'dotenv';
import { getConnection } from 'typeorm';
import { CreateShopInfoDto } from '../dto/shop-info.dto';
import { ShopInfo } from '../entities/shop-info.entity';

dotenv.config();

const seed: CreateShopInfoDto = {
  name: process.env.SHOP_NAME,
};

export async function createShopInfoSeeds() {
  const repository = getConnection().getRepository(ShopInfo);
  const qty = await repository.count();
  if (qty > 0) return;

  const shopInfo = repository.create(seed as ShopInfo);
  await repository.save(shopInfo);
}
