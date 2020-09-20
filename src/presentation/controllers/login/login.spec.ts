import { MissingParamError } from './../../errors/missing-param-error';
import { badRequest } from './../../helpers/http-helper';
import supertest from "supertest";
import { LoginController } from "./login";
import { InvalidParamError } from '../../errors';

const makeSut = () => {
  return new LoginController();
}

describe('Login Controller', () => {
  test('Should returns 400 if no email is provided', async () => {
    const su = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const response = await su.handle(httpRequest);
    expect(response.statusCode).toBe(400);
    expect(response).toEqual(badRequest(new MissingParamError('email')));
  });
  
  test('Should return 400 if no password is provided', async () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }

    const response = await sut.handle(httpRequest);
    
    expect(response.statusCode).toBe(400);
    expect(response).toEqual(badRequest(new MissingParamError('password')));
  });
})