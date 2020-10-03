import { Validation } from '../../../presentation/protocols/validation';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../presentation/helpers/validators';

export const makeLoginValidation = (): Validation => {
  const validations: Validation[] = [];
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field));
  }
  const emailValidatorAdapter = new EmailValidatorAdapter();
  validations.push(new EmailValidation(emailValidatorAdapter, 'email'));

  const validationComposite = new ValidationComposite(validations);
  return validationComposite;
}