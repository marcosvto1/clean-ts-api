import { EmailValidation, CompareFieldsValidation, RequiredFieldValidation, ValidationComposite } from './../../../presentation/helpers/validators';
import { Validation } from '../../../presentation/protocols/validation';
import { makeSignUpValidation } from './signup-validation-factory';
import { EmailValidator } from '../../../presentation/protocols/email-validator';

jest.mock('./../../../presentation/helpers/validators/validation-composite');

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true; // inicializar sempre positivos nos mocks
    }
  }
  const emailValidatorStub = new EmailValidatorStub();
  return emailValidatorStub;
}

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();

    const validations: Validation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'));
    validations.push(new EmailValidation('email', makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
})