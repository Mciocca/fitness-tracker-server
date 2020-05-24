import createFactory from './createFactory';
import WorkoutSet from '../../src/entity/WorkoutSet';
import faker from 'faker';

const workoutSetFixtureData = {
  weight: faker.random.number(),
  reps: faker.random.number()
};

export default (params?: object) => createFactory(WorkoutSet, params, workoutSetFixtureData);
