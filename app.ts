import 'reflect-metadata';
import express, { Application } from 'express';
import bodyParser from 'body-parser';

import { createConnection } from 'typeorm';
import { User } from './src/entities/User.entity';

import jwtConfig from './src/config/jwt.config';

import homeRoutes from './src/routes/home.routes';
import userRoutes from './src/routes/user.routes';
import productReviewRoutes from './src/routes/productReview.routes';
import productRoutes from './src/routes/product.routes';
import categoryRoutes from './src/routes/category.routes';
import addressRoutes from './src/routes/address.routes';
import couponRoutes from './src/routes/coupon.routes';
import shopInfoRoutes from './src/routes/shopInfo.routes';
import cartRoutes from './src/routes/cart.routes';
import orderRoutes from './src/routes/order.routes';
import shippingRoutes from './src/routes/shipping.routes';

import passport from 'passport';
import passportJWT from 'passport-jwt';
import { ShopInfo } from './src/entities/ShopInfo.entity';

createConnection().then((connection) => {
  class Server {
    private app: Application;

    constructor() {
      this.app = express();
      this.config();
      this.passportConfig();
      this.routerConfig();
      this.createShop();
    }

    private config() {
      this.app.use(bodyParser.urlencoded({ extended: true }));
      this.app.use(bodyParser.json({ limit: '1mb' }));
    }

    private passportConfig() {
      let ExtractJwt = passportJWT.ExtractJwt;
      let JwtStrategy = passportJWT.Strategy;

      const jwtOptions = {
        secretOrKey: jwtConfig.secretOrKey,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      };

      let strategy = new JwtStrategy(
        jwtOptions,
        async function (jwt_payload, next) {
          const userRepository = connection.getRepository(User);

          const id = jwt_payload.id;
          let user = userRepository.findOne(id);

          if (user) {
            next(null, user);
          } else {
            next(null, false);
          }
        },
      );

      passport.use(strategy);
      this.app.use(passport.initialize());
    }

    private routerConfig() {
      this.app.use('/api/admin/info', shopInfoRoutes);
      this.app.use('/', homeRoutes);
      this.app.use('/api/users', userRoutes);
      this.app.use('/api/products/reviews', productReviewRoutes);
      this.app.use('/api/products', productRoutes);
      this.app.use('/api/categories', categoryRoutes);
      this.app.use('/api/addresses', addressRoutes);
      this.app.use('/api/coupons', couponRoutes);
      this.app.use('/api/carts', cartRoutes);
      this.app.use('/api/orders', orderRoutes);
      this.app.use('/api/shippings', shippingRoutes);
    }

    private async createShop() {
      const shopInfoRepository = connection.getRepository(ShopInfo);

      if (!(await shopInfoRepository.findOne(1))) {
        const shopInfo = new ShopInfo();
        shopInfo.name = process.env.SHOP_NAME;

        await shopInfoRepository.save(shopInfo);
      }
    }

    public start = (port: number) => {
      return new Promise((resolve, reject) => {
        this.app
          .listen(port, () => {
            resolve(port);
          })
          .on('error', (err: Object) => reject(err));
      });
    };
  }

  const port = parseInt(process.env.PORT || '3000');

  new Server()
    .start(port)
    .then((port) => console.log(`Running on port ${port}`))
    .catch((error) => console.log(error));
});
