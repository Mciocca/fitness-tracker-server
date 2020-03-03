import { validateOrReject } from 'class-validator';
import { arrayValidationErrors } from '../utils/validationErrorFormatter';
import Profile from '../entity/Profile';
import User from '../entity/User';

export default class UserUpdater {
  public errorStatus: number;
  public errors: { errors: string[] };
  public user: User;
  public userParams: any;

  private ALLOWED_USER_PARAMS = ['firstName', 'lastName', 'email'];
  private ALLOWED_PROFILE_PARAMS = ['age', 'goal', 'gender', 'startingWeight', 'height'];

  constructor(userParams: object, user: User) {
    this.userParams = userParams;
    this.user = user;
  }

  public async update() {
    this.updateUser();
    try {
      await validateOrReject(this.user);
    } catch (error) {
      this.errors = { errors: arrayValidationErrors(error) };
      this.errorStatus = 400;
      return false;
    }

    try {
      this.user = await this.user.save();
      return true;
    } catch (error) {
      this.errors = ({ errors: ['Something went wrong, please try again.'] });
      this.errorStatus = 500;
      return false;
    }
  }

  private updateUser(): void  {
    this.ALLOWED_USER_PARAMS.forEach((attr) => {
      this.user[attr] = this.userParams[attr];
    });

    this.user.profile = this.user.profile || new Profile();
    this.ALLOWED_PROFILE_PARAMS.forEach((attr) => {
      this.user.profile[attr] = this.userParams.profile[attr];
    });
  }
}
