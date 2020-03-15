import { Request, Response } from 'express';
import Exercise from '../../../entity/Exercise';

export default class ExerciseController {
  public static async search(req: Request, res: Response) {
    const results =  await Exercise.searchByName(req.query.name, req.query.muscleGroup);
    res.status(200);
    res.json(results);
  }
};