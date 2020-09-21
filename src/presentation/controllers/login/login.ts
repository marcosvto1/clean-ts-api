import { serverError, unauthorized, badRequest, ok } from './../../helpers/http-helper';
import { HttpRequest, HttpResponse, Controller, Authentication, EmailValidator } from './login-protocols';
import { MissingParamError, ServerError, InvalidParamError } from '../../errors';

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

      const accessToken = await this.authentication.auth(email, password);
      if (!accessToken) {
        return unauthorized();
      }

      return ok({
        accessToken
      })

    } catch (error) {
      return serverError(new ServerError(error));
    }
  }

}