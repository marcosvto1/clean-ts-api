import { MissingParamError } from '@/presentation/errors/missing-param-error';
import { RequiredFieldValidation } from './required-field-validation';

const makeSut = (): RequiredFieldValidation =>  {
  return new RequiredFieldValidation('any_field');
}

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut();
    const isValid = sut.validate({});
    expect(isValid).toEqual(new MissingParamError('any_field'));
  });

  test('Should not return if validation success', () => {
    const sut = makeSut();
    const isValid = sut.validate({any_field: 'any_value'});
    expect(isValid).toBeUndefined();
  })
});