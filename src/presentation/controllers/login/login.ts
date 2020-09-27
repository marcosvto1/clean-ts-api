import { serverError, unauthorized, badRequest, ok } from '../../helpers/http/http-helper';
import { HttpRequest, HttpResponse, Controller, Authentication, Validation } from './login-protocols';
import { ServerError } from '../../errors';

export class LoginController implements Controller {
  private readonly authentication: Authentication;
  private readonly validation: Validation;

  constructor(authentication: Authentication, validation: Validation) {
    this.authentication = authentication;
    this.validation = validation;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {

      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const { email, password } = httpRequest.body; 

      const accessToken = await this.authentication.auth({email, password});
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