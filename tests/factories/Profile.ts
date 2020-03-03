import createFactory from './createFactory';
import Profile from '../../src/entity/Profile';

export const profileFixtureData =  {
  age: 30,
  gender: 'Male',
  goal: 'Gain weight',
  height: 69,
  startingWeight: 155
};

export default (params?: object) => createFactory(Profile, params, profileFixtureData);
