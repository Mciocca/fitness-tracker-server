import createExerciseFactory from '../factories/ExerciseFactory';
import { serializeSearchResults } from '../../src/serializers/ExerciseSerializer';
import { expect } from 'chai';

describe('Exercise Serializer', () => {
  it('returns the expected object', () => {
    const exercise = createExerciseFactory();
    exercise.id = 12;
    const expected = {
      exercises : [ {id: exercise.id, name: exercise.name, muscleGroup: exercise.muscleGroup } ],
      meta: {
        options: {
          muscleGroups: [exercise.muscleGroup]
        }
      }
    };

    const result = serializeSearchResults([exercise], [exercise.muscleGroup]);

    expect(result).to.eql(expected);
  });
});
