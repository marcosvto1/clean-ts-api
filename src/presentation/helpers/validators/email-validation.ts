import { InvalidParamError } from './../../errors/invalid-param-error';
import { EmailValidator } from '../../protocols/email-validator';
import { Validation } from './validation';

export class EmailValidation implements Validation {
  private readonly fieldName: string;
  private readonly emailValidator: EmailValidator;
  constructor (emailValidator: EmailValidator, fieldName: string) {
    this.fieldName = fieldName;
    this.emailValidator = emailValidator;
  }

  validate (input: any): Error {
    if (!this.emailValidator.isValid(input[this.fieldName])) {
      return new InvalidParamError(this.fieldName);
    }
  }
}