import { getManager } from 'typeorm';
import User from '../entity/User';
import Workout from '../entity/Workout';
import WorkoutSet from '../entity/WorkoutSet';
import { arrayValidationErrors } from '../utils/validationErrorFormatter';
import { validateOrReject } from 'class-validator';

const ALLOWED_WORKOUT_COLUMNS = ['title', 'date', 'weight', 'notes'];

export default class WorkoutCreationService {
  public errors: string[] = [];
  public workout: Workout;
  public sets: WorkoutSet[];
  public errorStatus: number;

  private workoutData: any;
  private currentUser: User;

  constructor(workoutData: any, currentUser: User) {
    this.workoutData = workoutData;
    this.currentUser = currentUser;
  }

  public async save() {
    this.workout = this.createWorkout();

    try {
      await validateOrReject(this.workout);
    } catch (error) {
      this.errors = arrayValidationErrors(error);
      this.errorStatus = 400;
      return false;
    }

    if (await this.runTransaction()) {
      return true;
    } else {
      this.errorStatus = 500;
      this.errors.push('There was a problem saving your workout');

      return false;
    }
  }

  private async runTransaction(): Promise<boolean> {
    let status = true;
    await getManager().transaction(async transactionalEntityManager => {
      try {
        await transactionalEntityManager.save(this.workout);
        this.createSets();
        await transactionalEntityManager.save(this.sets);
      } catch (error) {
        status = false;
      }
    });

    return status;
  }

  private createWorkout() {
    const workout = new Workout();
    ALLOWED_WORKOUT_COLUMNS.forEach((attr) => {
      workout[attr] = this.workoutData[attr];
    });

    workout.user = this.currentUser;
    return workout;
  }

  private createSets() {
    const sets = [];
    this.workoutData.sets.forEach((setData) => {
      const { weight, reps, exerciseId } = setData;
      const set = new WorkoutSet();
      set.weight = weight;
      set.reps = reps;
      set.exerciseId = exerciseId;
      set.workoutId = this.workout.id;
      sets.push(set);
    });

    this.sets = sets;
  }
}
