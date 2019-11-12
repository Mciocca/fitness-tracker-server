import * as express from 'express';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import routes from './config/routes';

createConnection().then(() => {
  const app = express();
  const port = 3000;

  app.use(routes);

  app.listen(port, err => {
    if (err) {
      return console.error(err);
    }
    return console.log(`server is listening on ${port}`);
  });
}).catch(error => console.log(error));
