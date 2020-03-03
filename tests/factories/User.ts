import User from '../../src/entity/User';
import ProfileFactory from './Profile';
import createFactory from './createFactory';
import faker from 'faker';

export const userFixtureData = () => ({
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  id: faker.random.number(),
  lastName: faker.name.lastName(),
  passwordHash: faker.random.alphaNumeric()
});

export const userWithProfileFixture = () => ({
  ...userFixtureData(),
  profile: ProfileFactory()
});

export const createUserWithProfile = (params?: object): User => createFactory(User, params, userWithProfileFixture());
export const createUser = (params?: object): User => createFactory(User, params, userFixtureData());
