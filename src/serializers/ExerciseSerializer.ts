import Exercise from '../entity/Exercise';

interface ISerializedExercise {
  id: number;
  name: string;
  muscleGroup: string;
}

interface ISerializedExerciseSearch {
  exercises: ISerializedExercise[];
  meta: {
    options: {
      muscleGroups: string[]
    }
  };
}

export const serializeSearchResults = (results: Exercise[], muscleGroups: string[]): ISerializedExerciseSearch => {
  const exercises = results.map(serializedExercise);
  const meta = {
    options: { muscleGroups }
  };

  return { exercises, meta };
};

export const serializedExercise = ({ id, name, muscleGroup }) => ({
  id,
  name,
  muscleGroup
});
