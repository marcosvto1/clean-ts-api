import { EmailValidator } from '@/validation/protocols/email-validator';
import { EmailValidatorAdapter } from "./email-validator-adapter";
import validator from 'validator';

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true;
  },
}));

const makeSut = (): EmailValidator => {
  return new EmailValidatorAdapter();
}

describe('EmailValidator Adptar', () => {
  test('Should return false if validator returns false', () => {
    const sut = makeSut();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValid = sut.isValid('invalid_email@mail.com');
    expect(isValid).toBe(false);
  });

  test('Should return true if validator returns true', () => {
    const sut = makeSut();
    const isValid = sut.isValid('valid_email@mail.com');
    expect(isValid).toBe(true);
  });

  test('Should call validator with correct email', () => {
    const sut = makeSut();
    const isEmailSpy = jest.spyOn(validator, 'isEmail');
    sut.isValid('any@mail.com');
    expect(isEmailSpy).toHaveBeenCalledWith('any@mail.com')
  });
});