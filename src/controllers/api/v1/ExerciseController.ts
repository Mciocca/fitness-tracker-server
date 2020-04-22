import { Request, Response } from 'express';
import Exercise from '../../../entity/Exercise';
import { serializeSearchResults } from '../../../serializers/ExerciseSerializer';

export default class ExerciseController {
  public static async search(req: Request, res: Response) {
    const exercises =  await Exercise.searchByName(req.query.name, req.query.muscleGroup);
    const muscleGroups = await Exercise.getMuscleGroups();
    res.status(200);
    res.json(serializeSearchResults(exercises, muscleGroups));
  }
}
