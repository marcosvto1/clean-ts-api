import { AuthMiddleware } from './auth-middleware';
import { AccessDeniedError } from './../errors';
import { forbidden } from './../helpers/http/http-helper';
import { HttpRequest } from './../protocols/http';

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exits in headers', async () => {
    const sut = new AuthMiddleware();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });
})