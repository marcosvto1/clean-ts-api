import { MissingParamError } from './../../errors/missing-param-error';
import { RequiredFieldValidation } from './required-field-validation';

describe('RequiredField Validation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('any_field');
    const isValid = sut.validate({});
    expect(isValid).toEqual(new MissingParamError('any_field'));
  });
});