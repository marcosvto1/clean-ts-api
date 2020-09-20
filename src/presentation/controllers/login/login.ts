import { badRequest } from '../../helpers/http-helper';
import { HttpRequest, HttpResponse } from '../../protocols';
import { Controller } from './../../protocols/controller';
import { MissingParamError } from '../../errors';

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password'];
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return new Promise((resolve) => resolve(badRequest(new MissingParamError(field))));
      }
    }
  }
}