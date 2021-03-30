import express, { Application, Router } from 'express'
import bodyParser from 'body-parser'
// import pool from './src/config/database.config';

import jwtConfig from './src/config/jwt.config'

import User from './src/models/user.model'

import homeRoutes from './src/routes/home.routes'

import passport from 'passport'
import passportJWT from 'passport-jwt';

class Server {
  private app;

  constructor() {
    this.app = express();
    this.config();
    this.passportConfig()
    this.routerConfig();
    // this.dbConnect();
  }

  private config() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json({ limit: '1mb' }));
  }

  // private dbConnect() {
  //   pool.connect(function (err, client, done) {
  //     if (err) throw new Error(err.message);
  //     console.log('Database connected');
  //   })
  // }

  private passportConfig() {

    let ExtractJwt = passportJWT.ExtractJwt;
    let JwtStrategy = passportJWT.Strategy;

    const jwtOptions = {
      secretOrKey: jwtConfig.secretOrKey,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
      const id = jwt_payload.id
      let user = User.findByPk(id)

      if (user) {
        next(null, user);
      } else {
        next(null, false);
      }

    })

    passport.use(strategy)
    this.app.use(passport.initialize())

  }

  private routerConfig() {
    this.app.use('/', homeRoutes);
  }

  public start = (port: number) => {
    return new Promise((resolve, reject) => {
      this.app.listen(port, () => {
        resolve(port);
      }).on('error', (err: Object) => reject(err));
    })
  }

}

export default Server;