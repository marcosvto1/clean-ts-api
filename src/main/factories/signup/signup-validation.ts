import { RequiredFieldValidation } from './../../../presentation/helpers/validators/required-field-validation';
import { ValidationComposite } from './../../../presentation/helpers/validators/validation-composite';
import { Validation } from '../../../presentation/helpers/validators/validation';
import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compare-fields-validation';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation';

export const makeSignUpValidation = (): Validation => {

  const validations: Validation[] = [];
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field));
  }

  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'));

  const emailValidatorAdapter = new EmailValidatorAdapter();
  validations.push(new EmailValidation(emailValidatorAdapter, 'email'));

  const validationComposite = new ValidationComposite(validations);
  return validationComposite;
}