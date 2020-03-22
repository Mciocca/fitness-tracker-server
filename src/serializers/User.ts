import User from '../entity/User';
import { enumValuesToArray } from '../utils/enumHelpers';
import { Gender, Goals } from '../entity/Profile';

export const serializeUser = async (user: User) => {
  const profile = await user.profile;
  return {
    email: user.email,
    firstName: user.firstName,
    id: user.id,
    lastName: user.lastName,
    name: user.fullName,
    profile: {
      age: profile?.age,
      gender: profile?.gender,
      goal: profile?.goal,
      height: profile?.height,
      options: {
        gender: enumValuesToArray(Gender),
        goals: enumValuesToArray(Goals)
      },
      startingWeight: user.profile?.startingWeight
    },
    updateUrl: '/api/v1/user',
  };
};
