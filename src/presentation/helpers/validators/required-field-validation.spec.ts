import { MissingParamError } from './../../errors/missing-param-error';
import { RequiredFieldValidation } from './required-field-validation';

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('any_field');
    const isValid = sut.validate({});
    expect(isValid).toEqual(new MissingParamError('any_field'));
  });

  test('Should not return if validation success', () => {
    const sut = new RequiredFieldValidation('any_field');
    const isValid = sut.validate({any_field: 'any_value'});
    expect(isValid).toBeUndefined();
  })
});