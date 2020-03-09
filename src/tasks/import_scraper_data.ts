import { createConnection, ConnectionOptions } from 'typeorm';
import { developmentConfig } from './config/orm_config';
import fs from 'fs';
import Exercise from '../entity/Exercise';

let db;
const importData = async () => {
  db = await createConnection(developmentConfig as ConnectionOptions);
  const directory = `${__dirname}/scraper_output`;
  const files = fs.readdirSync(directory);
  // for..of instead of forEach keeps this synchronous and allows us to close db connection properly
  for (const file of files) {
    const content = fs.readFileSync(`${directory}/${file}`, 'UTF-8');
    const arr = JSON.parse(content);
    for (const item of arr) {
      const exercise = Exercise.create(item);
      await exercise.save();
    }
  }
};

importData().then(() => {
  db.close();
});
