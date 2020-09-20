import { serverError } from './../../helpers/http-helper';
import { InvalidParamError } from './../../errors/invalid-param-error';
import { EmailValidator } from './../../protocols/email-validator';
import { badRequest } from '../../helpers/http-helper';
import { HttpRequest, HttpResponse } from '../../protocols';
import { Controller } from './../../protocols/controller';
import { MissingParamError, ServerError } from '../../errors';
import { Authentication } from '../../../domain/usecases/authentication';

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly authentication: Authentication;
  constructor(emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator;
    this.authentication = authentication;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password'];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
        }
      }
      const isValid = this.emailValidator.isValid(httpRequest.body.email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const { email, password } = httpRequest.body; 

      await this.authentication.auth(email, password);

    } catch (error) {
      return serverError(new ServerError(error));
    }
  }

}