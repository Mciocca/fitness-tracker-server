import express from 'express';
import 'reflect-metadata';
import routes from './config/routes';

const app = express();
const port = 3000;

app.use(routes);

app.listen(port, err => { 
  if (err) { 
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});

export default app;
