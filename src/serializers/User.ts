import User from '../entity/User';

export const serializeUser = (user: User) => {
  return {
    email: user.email,
    id: user.id,
    name: user.fullName,
  };
};
