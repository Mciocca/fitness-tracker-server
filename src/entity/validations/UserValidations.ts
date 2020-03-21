import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments
} from 'class-validator';
import User from '../User';

export const userPasswordValidation = (validationOptions: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'userPasswordValidation',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const user = args.object as User;
          if (user.passwordHash && !value) {
            return true;
          }

          if (!user.passwordHash && !value) {
            return false;
          }

          if (!user.passwordHash && value && value.length >= 6 ) {
            return true;
          } else {
            return false;
          }
        }
      }
    });
  };
};
