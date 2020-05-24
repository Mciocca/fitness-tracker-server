import { Response } from 'express';
import Workout from '../../../entity/Workout';
import WorkoutCreationService from '../../../services/WorkoutCreationService';

export default class WorkoutController {
  public static async show(req: any, res: Response) {
    const workout = await req.user.workouts.findOne(req.params.id);
    res.status(200);
    res.json(workout);
  }

  public static async create(req: any, res: Response) {
    const creationService = new WorkoutCreationService(req.body.workout, req.user);
    if (await creationService.save()) {
      const workout = await Workout.findOne(creationService.workout.id);
      res.status(200);
      res.json(workout);
    } else {
      res.status(creationService.errorStatus);
      res.json({ errors: creationService.errors });
    }
  }
}