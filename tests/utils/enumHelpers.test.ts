import { expect } from 'chai';
import { enumValuesToArray } from '../../src/utils/enumHelpers';

enum test {
  HELLO = 'world',
  FOO = 'bar'
}

describe('Enum helpers', () => {
  it('returns an array of strings with the enum options', () => {
    const expected = ['world', 'bar'];
    expect(expected).to.deep.eq(enumValuesToArray(test));
  });
});
