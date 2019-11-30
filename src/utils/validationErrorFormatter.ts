import { ValidationError } from 'class-validator';

export const htmlValidationErrors = (errors: ValidationError[]): string => {
  let errorString: string = '<ul>';

  errors.forEach(error => {
    errorString = errorString + Object.keys(error.constraints).reduce(
      (previous, current) => previous + `<li>${error.constraints[current]}</li>`,
      '',
    );
  });

  return errorString + '</ul>';
};
