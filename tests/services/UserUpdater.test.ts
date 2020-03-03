import UserUpdater from '../../src/services/UserUpdater';
import { expect } from 'chai';
import { createUserWithProfile, userWithProfileFixture } from '../factories/User';

describe('User Updater Service', () => {
  let fixture;
  let user;

  before(() => {
    fixture = userWithProfileFixture();
    user = createUserWithProfile(fixture);
    user.save = async () => Promise.resolve(user);
  });

  describe('succesfully updating', () => {
    it('can succesfully update a user', async () => {
      const userParams = {
        ...fixture,
        firstName: 'cat',
        lastName: 'dog'
      };
      const updater = new UserUpdater(userParams, user);

      expect(await updater.update()).to.eq(true);
      expect(updater.user.firstName).to.eq(userParams.firstName);
      expect(updater.user.lastName).to.eq(userParams.lastName);
    });

    it('can succesfully update a profile', async () => {
      const age = fixture.profile.age + 10;
      const profileParams = { ...fixture.profile, age };
      const userParams = {
        ...fixture,
        profile: profileParams,
      };
      const updater = new UserUpdater(userParams, user);

      expect(await updater.update()).to.eq(true);
      expect(updater.user.profile.age).to.eq(age);
    });

    it('only updates white listed attributes', async () => {
      const passwordHash = 'thisShouldNotExist';
      const userParams = {
        ...fixture,
        passwordHash
      };

      const updater = new UserUpdater(userParams, user);
      expect(await updater.update()).to.eq(true);
      expect(updater.user.passwordHash).to.not.eq(passwordHash);
    });
  });

  describe('validation errors', () => {
    it('creates error messages when validations fail', async() => {
      const userParams = {
        ...fixture,
        email: 'bademail'
      };
      const updater = new UserUpdater(userParams, user);

      expect(await updater.update()).to.eq(false);
      expect(updater.errors.errors.length).to.eq(1);
      expect(updater.errorStatus).to.eq(400);
      expect(updater.errors.errors[0]).to.include('Email is not valid');
    });
  });

  describe('when save fails', () => {
    it('sets the correct error message', async () => {
      const failedUser = createUserWithProfile(fixture);
      failedUser.save = () => Promise.reject(false);

      const userParams = { ...fixture };
      const updater = new UserUpdater(userParams, failedUser);

      expect(await updater.update()).to.eq(false);
      expect(updater.errors.errors.length).to.eq(1);
      expect(updater.errorStatus).to.eq(500);
      expect(updater.errors.errors[0]).to.include('Something went wrong, please try again')
    });
  });
});
