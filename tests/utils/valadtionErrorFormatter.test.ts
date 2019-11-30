import { expect } from 'chai';
import { ValidationError } from 'class-validator';
import { htmlValidationErrors } from '../../src/utils/validationErrorFormatter';

const validationError = new ValidationError();
validationError.constraints = {
  email: 'Email is required',
  password: 'Password is required',
};

describe('Validation Error Formatter', () => {
  it('returns the expected message', () => {
    const message = htmlValidationErrors([validationError]);
    const errorHtml = Object.keys(validationError.constraints).reduce(
      (acc, next) => acc + `<li>${validationError.constraints[next]}</li>`,
      '',
    );

    expect(message).to.eq('<ul>' + errorHtml + '</ul>');
  });
});
