import createFactory from './createFactory';
import Exercise from '../../src/entity/Exercise';
import faker from 'faker';

export const exerciseFixtureData =  {
  name: faker.lorem.word(),
  muscleGroup: faker.lorem.word()
};

export default (params?: object) => createFactory(Exercise, params, exerciseFixtureData);
