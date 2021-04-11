import "reflect-metadata";
import express, { Application, Router } from "express";
import bodyParser from "body-parser";

import { createConnection, getConnection } from "typeorm";
import { User } from "./src/entity/User";

import jwtConfig from "./src/config/jwt.config";

import homeRoutes from "./src/routes/home.routes";
import userRoutes from "./src/routes/user.routes";
import productRoutes from "./src/routes/product.routes";

import passport from "passport";
import passportJWT from "passport-jwt";

createConnection().then((connection) => {
  class Server {
    private app: Application;

    constructor() {
      this.app = express();
      this.config();
      this.passportConfig();
      this.routerConfig();
    }

    private config() {
      this.app.use(bodyParser.urlencoded({ extended: true }));
      this.app.use(bodyParser.json({ limit: "1mb" }));
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
        }
      );

      passport.use(strategy);
      this.app.use(passport.initialize());
    }

    private routerConfig() {
      this.app.use("/", homeRoutes);
      this.app.use("/api/users", userRoutes);
      this.app.use("/api/products", productRoutes);
    }

    public start = (port: number) => {
      return new Promise((resolve, reject) => {
        this.app
          .listen(port, () => {
            resolve(port);
          })
          .on("error", (err: Object) => reject(err));
      });
    };
  }

  const port = parseInt(process.env.PORT || "3000");

  new Server()
    .start(port)
    .then((port) => console.log(`Running on port ${port}`))
    .catch((error) => console.log(error));
});
