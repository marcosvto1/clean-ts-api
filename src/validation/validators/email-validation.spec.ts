import { EmailValidation } from './email-validation';
import { EmailValidator } from '../protocols/email-validator';
import { InvalidParamError } from '../../presentation/errors/invalid-param-error';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true; // inicializar sempre positivos nos mocks
    }
  }
  const emailValidatorStub = new EmailValidatorStub();
  return emailValidatorStub;
}

type SutTypes = {
  sut: EmailValidation,
  emailValidatorStub: EmailValidator,
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new EmailValidation('email', emailValidatorStub);
  return {
    emailValidatorStub,
    sut
  }
}

describe('Email Validation', () => {

  test('Should return an error if EmailValidator returns false', async () => {
    const {sut, emailValidatorStub }  = makeSut();
    
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(
      false
    );
     
    const error  = sut.validate({
      email: 'any_mail@mail.com'
    });
 
    expect(error).toEqual(new InvalidParamError('email'));

  });


  test('Should call EmailValidator with correct email', () => {
    const {sut, emailValidatorStub }  = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({
      email: 'any_mail@mail.com'
    });

    expect(isValidSpy).toHaveBeenCalledWith('any_mail@mail.com')
  });

  test('Should throws if EmailValidator throws with', async () => {
    const { sut, emailValidatorStub} = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(
      () => {
        throw new Error();
      }
    );

    expect(sut.validate).toThrow();
  });

});
