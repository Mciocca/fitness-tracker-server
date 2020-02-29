import User from '../entity/User';
import { enumValuesToArray } from '../utils/enumHelpers';
import { Gender, Goals } from '../entity/Profile';

export const serializeUser = (user: User) => {
  return {
    email: user.email,
    firstName: user.firstName,
    id: user.id,
    lastName: user.lastName,
    name: user.fullName,
    profile: {
      age: user.profile?.age,
      gender: user.profile?.gender,
      goal: user.profile?.goal,
      height: user.profile?.height,
      options: {
        gender: enumValuesToArray(Gender),
        goals: enumValuesToArray(Goals)
      },
      startingWeight: user.profile?.startingWeight
    },
    updateUrl: '/api/v1/user',
  };
};
