import { HttpRequest } from './../../protocols/http';
import { SignUpController } from './signup';
import { MissingParamError, InvalidParamError, ServerError } from '../../errors';
import { EmailValidator, AddAccount, AddAccountModel, AccountModel } from './signup-protocols';
import { ok, serverError, badRequest } from './../../helpers/http-helper';
import { Validation } from '../../helpers/validators/validation';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true; // inicializar sempre positivos nos mocks
    }
  }
  const emailValidatorStub = new EmailValidatorStub();
  return emailValidatorStub;
}

const makeFakerAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return Promise.resolve(makeFakerAccount());
    }
  }
  const addAccountStub = new AddAccountStub();
  return addAccountStub;
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  const validationStub = new ValidationStub();
  return validationStub;
}

/*const makeEmailValidatorWithError = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      throw new Error(); // inicializar sempre positivos nos mocks
    }
  }
  const emailValidatorStub = new EmailValidatorStub();
  return emailValidatorStub;
} */

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  };
}

interface SutTypes{
  sut: SignUpController,
  emailValidatorStub: EmailValidator,
  addAccountStub: AddAccount,
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub);
  return {
    emailValidatorStub,
    addAccountStub,
    validationStub, 
    sut
  }
}

describe('SignUp Controller', () => {

  test('Should return 400 if an invalid email is provided', async () => {
    const {sut, emailValidatorStub }  = makeSut();
    
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(
      false
    );
    const httpResponse = await sut.handle(makeFakeRequest());
 
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));


  });

  test('Should call EmailValidator with correct email', () => {
    const {sut, emailValidatorStub }  = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.handle( makeFakeRequest());
    expect(isValidSpy).toHaveBeenCalledWith('any_mail@mail.com')
  });

  /* test('Should return 500 if EmailValidator throws', () => {
    const emailValidatorStub = makeEmailValidatorWithError();
    const sut = new SignUpController(emailValidatorStub);
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());

  }); */

  test('Should return 500 if EmailValidator throws with jest', async () => {
    const { sut, emailValidatorStub} = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(
      () => {
        throw new Error();
      }
    )
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test('Should call AddAccout with correct values', () => {
    const { sut, addAccountStub }  = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add')
    sut.handle(makeFakeRequest());
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password',
    })
  });

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(
      async () => {
        return new Promise((resolve, reject) => reject(new Error()))
      }
    )
  
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test('Should return 200 if valid data is provided', async () => {
    const {sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakerAccount()));
  });

  test('Should call Validation with correct value', () => {
    const { sut, validationStub }  = makeSut();
    const validadeSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = makeFakeRequest();
    sut.handle(makeFakeRequest());
    expect(validadeSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
     jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')));
  });


})
