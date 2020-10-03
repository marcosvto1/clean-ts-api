import { Validation } from '../../../presentation/protocols/validation';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';
import { EmailValidation, CompareFieldsValidation, ValidationComposite, RequiredFieldValidation} from '../../../presentation/helpers/validators';

export const makeSignUpValidation = (): Validation => {

  const validations: Validation[] = [];
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field));
  }

  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'));

  const emailValidatorAdapter = new EmailValidatorAdapter();
  validations.push(new EmailValidation('email', emailValidatorAdapter));

  const validationComposite = new ValidationComposite(validations);
  return validationComposite;
}