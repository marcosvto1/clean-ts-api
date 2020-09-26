import { EmailValidation } from '../../../presentation/helpers/validators/email-validation';
import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compare-fields-validation';
import { Validation } from '../../../presentation/helpers/validators/validation';
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation';
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite';
import { EmailValidator } from '../../../presentation/protocols/email-validator';
import { makeLoginValidation } from './login-validation';

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

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation();

    const validations: Validation[] = [];
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new EmailValidation(makeEmailValidator(), 'email'))

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
})