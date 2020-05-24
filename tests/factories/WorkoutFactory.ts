import createFactory from './createFactory';
import setFactory from './WorkoutSetFactory';
import Workout from '../../src/entity/Workout';
import faker from 'faker';

const workoutFixtureData = {
  title: faker.lorem.word(),
  notes: faker.lorem.sentence(),
  weight: faker.random.number(),
  date: new Date()
};

const workoutWithSetFixtureData = {
  ...workoutFixtureData,
  sets: [setFactory()]
};

export default (params?: object) => createFactory(Workout, params, workoutFixtureData);
export const workoutWithSetFactory = (params?: object) => createFactory(Workout, params, workoutWithSetFixtureData);
