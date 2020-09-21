import { LoginController } from "./login";
import { InvalidParamError, MissingParamError } from '../../errors';
import { Authentication, Controller, EmailValidator, HttpRequest } from './login-protocols';
import { badRequest, serverError, unauthorized, ok} from './../../helpers/http-helper';


const makeRequest = (): HttpRequest => {
  return {
    body: {
      email: 'any_mail@mail.com',
      password: 'any_password'
    }
  }
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub {
    async auth(email: string, password: string): Promise<string> {
      return 'any_token';
    }
  }

  return new AuthenticationStub();
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
}

type SutTypes = {
  sut: Controller;
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthentication();
  const sut = new LoginController(emailValidatorStub, authenticationStub);
  return {
    sut,
    emailValidatorStub,
    authenticationStub
  }
}

describe('Login Controller', () => {
  test('Should returns 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const response = await sut.handle(httpRequest);
    expect(response.statusCode).toBe(400);
    expect(response).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }

    const response = await sut.handle(httpRequest);

    expect(response.statusCode).toBe(400);
    expect(response).toEqual(badRequest(new MissingParamError('password')));
  });

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        password: 'any_password'
      }
    }

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const response = await sut.handle(httpRequest);

    expect(response.statusCode).toBe(400);
    expect(response).toEqual(badRequest(new InvalidParamError('email')));
  });

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();

    const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid');

    await sut.handle(makeRequest());

    expect(emailValidatorSpy).toHaveBeenCalledWith('any_mail@mail.com');
  });

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(
      () => {
        throw new Error();
      }
    );

    const httpResponse = await sut.handle(makeRequest());

    await expect(httpResponse).toEqual(serverError(new Error()));

  });

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();

    const authSpy = jest.spyOn(authenticationStub, 'auth');

    await sut.handle(makeRequest());

    expect(authSpy).toHaveBeenCalledWith('any_mail@mail.com', 'any_password');
  });

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
      new Promise((resolve) => resolve(null))
    );

    const httpResponse = await sut.handle(makeRequest());

    await expect(httpResponse).toEqual(unauthorized());

  });

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const httpResponse = await sut.handle(makeRequest());

    await expect(httpResponse).toEqual(serverError(new Error()));

  });

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeRequest());

    await expect(httpResponse).toEqual(ok({
      accessToken: 'any_token'
    }));

  });

})