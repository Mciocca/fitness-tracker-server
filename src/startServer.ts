/* tslint:disable:ordered-imports */
import express from 'express';
import path from 'path';
// middleware
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { createTypeOrmConnection } from './config/createTypeOrmConnection';
import csurf from 'csurf';
import morgan from 'morgan';

import 'reflect-metadata';
// routes
import AuthRoutes from './routes/authRoutes';
import ApiV1Routes from './routes/apiV1';

export const startServer = async () => {
  const dbConnection = await createTypeOrmConnection();
  const app = express();
  const port = process.env.NODE_ENV === 'test' ? 4567 : 4000;

  app.set('views', path.join(`${__dirname}/views`));
  app.use(passport.initialize());
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(morgan('dev'));
  if (process.env.NODE_ENV !== 'test') app.use(csurf({ cookie: true }));

  // routes
  app.use(AuthRoutes);
  app.use(ApiV1Routes);

  app.set('view engine', 'ejs');

  const server = app.listen(port, err => {
    if (err) {
      return console.error(err);
    }
    app.emit('appStarted');
    return console.log(`server is listening on ${port}`);
  });
  return { app, server, dbConnection };
};
