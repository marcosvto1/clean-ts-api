import { CompareFieldsValidation } from './compare-fields-validation';
import { MissingParamError } from '../../errors/missing-param-error';
import { InvalidParamError } from '../../errors';

const makeSut = (): CompareFieldsValidation =>  {
  return new CompareFieldsValidation('any_field', 'any_field_compare');
}

describe('RequiredField Validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut();
    const isValid = sut.validate({
      any_field: 'any_value',
      any_field_compare: 'any_value_compare'
    });
    expect(isValid).toEqual(new InvalidParamError('any_field_compare'));
  });

  /* test('Should not return if validation success', () => {
    const sut = makeSut();
    const isValid = sut.validate({any_field: 'any_value'});
    expect(isValid).toBeUndefined();
  }) */


});