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

export const arrayValidationErrors = (errors: ValidationError[]): string[] => {
  const arr = [];

  errors.forEach(error => {
    Object.keys(error.constraints).forEach(key => arr.push(error.constraints[key]));
  });

  return arr;
};
