// Modules
import 'reflect-metadata';
import 'colors';
import fs from 'fs';
import express, {
  Application as ExpressApplication,
  NextFunction,
  Request,
  Response,
} from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import { createConnection, getConnection } from 'typeorm';

// Configs
import jwtConfig from './src/config/jwt.config';

// Routes
import userRoutes from './src/routes/user.routes';
import productReviewRoutes from './src/routes/product-review.routes';
import productRoutes from './src/routes/product.routes';
import categoryRoutes from './src/routes/category.routes';
import addressRoutes from './src/routes/address.routes';
import couponRoutes from './src/routes/coupon.routes';
import shopInfoRoutes from './src/routes/shop-info.routes';
import cartRoutes from './src/routes/cart.routes';
import orderRoutes from './src/routes/order.routes';
import shippingRoutes from './src/routes/shipping.routes';
import permissionGroupRoutes from './src/routes/permission-group.routes';
import authRoutes from './src/routes/auth.routes';
import fileUploadRoutes from './src/routes/file-upload.routes';

// Entities
import { User } from './src/entities/user.entity';
import { createSeeds } from './src/seeds/seeds';

class Application {
  private app: ExpressApplication;

  constructor() {
    console.log('');
    console.log('Loading application...'.yellow);

    this.app = express();
    this.connect().then(async () => {
      this.config();
      await createSeeds();

      console.log('Application loaded!'.green);
      console.log('');
    });
  }

  private async connect() {
    await createConnection();
  }

  private config() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json({ limit: '1mb' }));

    this.logConfig();
    this.passportConfig();
    this.routerConfig();
  }

  private logConfig() {
    if (!fs.existsSync('./logs')) {
      fs.mkdirSync('./logs');
    }
  }

  private passportConfig() {
    let ExtractJwt = passportJWT.ExtractJwt;
    let JwtStrategy = passportJWT.Strategy;

    const jwtOptions = {
      secretOrKey: jwtConfig.secretOrKey,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    };

    let strategy = new JwtStrategy(jwtOptions, async function (
      jwt_payload,
      next,
    ) {
      const userRepository = getConnection().getRepository(User);

      const id = jwt_payload.id;
      let user = await userRepository.findOne(id);

      if (user) {
        next(null, user);
      } else {
        next(null, false);
      }
    });

    passport.use(strategy);
    this.app.use(passport.initialize());
  }

  private routerConfig() {
    console.log('Setting routers...'.yellow);

    this.app.use('*', (req: Request, res: Response, next: NextFunction) => {
      req.interceptor = {};
      req.dto = {};
      next();
    });

    this.app.use('/api/admin/info', shopInfoRoutes);
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/products/reviews', productReviewRoutes);
    this.app.use('/api/products', productRoutes);
    this.app.use('/api/categories', categoryRoutes);
    this.app.use('/api/addresses', addressRoutes);
    this.app.use('/api/coupons', couponRoutes);
    this.app.use('/api/carts', cartRoutes);
    this.app.use('/api/orders', orderRoutes);
    this.app.use('/api/shippings', shippingRoutes);
    this.app.use('/api/permission-groups', permissionGroupRoutes);
    this.app.use('/api', fileUploadRoutes);
    this.app.use('/api', authRoutes);
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

export default Application;
