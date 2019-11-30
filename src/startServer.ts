/* tslint:disable:ordered-imports */
import express from 'express';
import path from 'path';
// middleware
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import flash from 'connect-flash';
import { createTypeOrmConnection } from './config/createTypeOrmConnection';

import 'reflect-metadata';
// routes
import HomeRoutes from './routes/homeRoutes';
import AuthRoutes from './routes/authRoutes';

export const startServer = async () => {
  await createTypeOrmConnection();
  const app = express();
  const port = process.env.NODE_ENV === 'test' ? 4567 : 3000;

  app.set('views', path.join(`${__dirname}/views`));
  app.use(passport.initialize());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(flash());
  app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.sessionSecret,
  }));
  app.use(cookieParser());

  // routes
  app.use(HomeRoutes);
  app.use(AuthRoutes);

  app.set('view engine', 'ejs');

  const server = app.listen(port, err => {
    if (err) {
      return console.error(err);
    }
    app.emit('appStarted');
    return console.log(`server is listening on ${port}`);
  });

  return { app, server };
};
