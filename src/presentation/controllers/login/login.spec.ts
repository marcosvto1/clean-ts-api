import { HttpRequest } from './../../protocols/http';
import { EmailValidator } from './../../protocols/email-validator';
import { Controller } from './../../protocols/controller';
import { MissingParamError } from './../../errors/missing-param-error';
import { badRequest } from './../../helpers/http-helper';
import supertest from "supertest";
import { LoginController } from "./login";
import { InvalidParamError } from '../../errors';

const makeRequest = (): HttpRequest => {
  return {
    body: {
      email: 'any_mail@mail.com',
      password: 'any_password'
    }
  }
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
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new LoginController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub
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

})