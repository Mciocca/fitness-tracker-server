import {workoutWithSetFactory } from '../factories/WorkoutFactory';
import * as typeorm from 'typeorm';
import { expect } from 'chai';
import WorkoutCreationService from '../../src/services/WorkoutCreationService';
import { userWithProfileFixture } from '../factories/User';
import sinon from 'sinon';

describe('WorkoutCreationService', () => {
  let workout;
  let user;

  beforeEach(() => {
     user = userWithProfileFixture();
     workout = workoutWithSetFactory();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('returns false and contains errors when workout is not valid', async () => {
    delete workout.title;
    const creator = new WorkoutCreationService(workout, user);
    const isSaved = await creator.save();

    expect(isSaved).to.be.false;
    expect(creator.errors.length).to.eq(1);
    expect(creator.errors[0]).to.eq('Title is required');
    expect(creator.errorStatus).to.eq(400);
  });

  it('returns true when the workout is succesfully saved', async () => {
    const stub = sinon.stub(typeorm, 'getManager').callsFake((): any => ({
      transaction: (callback) => {
        callback({
          save: () => Promise.resolve()
        });
      }
    }));

    const creator = new WorkoutCreationService(workout, user);
    const saved = await creator.save();

    expect(saved).to.be.true;
    expect(creator.errors.length).to.eq(0);
  });

  it('returns false if the transaction fails', async () => {
    const stub = sinon.stub(typeorm, 'getManager').callsFake((): any => ({
      transaction: (callback) => {
        callback({
          save: () => Promise.reject()
        });
      }
    }));

    const creator = new WorkoutCreationService(workout, user);
    const saved = await creator.save();

    expect(saved).to.be.false;
    expect(creator.errors.length).to.eq(1);
    expect(creator.errors[0]).to.eq('There was a problem saving your workout');
    expect(creator.errorStatus).to.eq(500);
  });
});
