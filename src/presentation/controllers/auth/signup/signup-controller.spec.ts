import { EmailInUseError } from './../../../errors/email-in-use-error';
import { forbidden } from './../../../helpers/http/http-helper';
import { HttpRequest } from '../../../protocols/http';
import { SignUpController } from './signup-controller';
import { MissingParamError, ServerError } from '../../../errors';
import { AddAccount, AddAccountModel, AccountModel } from './signup-controller-protocols';
import { ok, serverError, badRequest } from '../../../helpers/http/http-helper';
import { Validation } from '../../../protocols/validation';
import { Authentication, AuthenticationModel } from '../login/login-controller-protocols';

const makeFakerAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeAuthentication = (): Authentication => {
  class AuthenticationStub {
    async auth(authentication: AuthenticationModel): Promise<string> {
      return 'any_token';
    }
  }

  return new AuthenticationStub();
}

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
  addAccountStub: AddAccount,
  validationStub: Validation,
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication();
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub);
  return {
    sut,
    addAccountStub,
    validationStub, 
    authenticationStub,
  }
}

describe('SignUp Controller', () => {

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();

    const authSpy = jest.spyOn(authenticationStub, 'auth');

    await sut.handle(makeFakeRequest());

    expect(authSpy).toHaveBeenCalledWith({email: 'any_mail@mail.com', password: 'any_password'});
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

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const httpResponse = await sut.handle(makeFakeRequest());

    await expect(httpResponse).toEqual(serverError(new Error()));

  });

  test('Should return 200 if valid data is provided', async () => {
    const {sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok({accessToken: 'any_token'}));
  });

  test('Should return 403 if AddAccount return null', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(new Promise(resolve => resolve(null)));

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
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