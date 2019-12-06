import { expect } from 'chai';
import { ValidationError } from 'class-validator';
import { arrayValidationErrors, htmlValidationErrors } from '../../src/utils/validationErrorFormatter';

const validationError = new ValidationError();
validationError.constraints = {
  email: 'Email is required',
  password: 'Password is required',
};

describe('Validation Error Formatter', () => {
  describe('htmlFormat', () => {
    it('returns the expected message', () => {
      const message = htmlValidationErrors([validationError]);
      const errorHtml = Object.keys(validationError.constraints).reduce(
        (acc, next) => acc + `<li>${validationError.constraints[next]}</li>`,
        '',
      );

      expect(message).to.eq('<ul>' + errorHtml + '</ul>');
    });
  });

  describe('array validation errors', () => {
    it('returns the expected array', ()  => {
      const expected = Object.keys(validationError.constraints).map(key => validationError.constraints[key]);
      const errors = arrayValidationErrors([validationError]);

      expect(expected).to.deep.equal(errors);
    });
  });
});
