import { Controller, HttpRequest, HttpResponse } from './../../presentation/protocols';
import { LogControllerDecorator } from "./log";


describe('LogController Decorator', () => {
  test('Should call controller handle ', async () => {
    class ControllerStub implements Controller {
      async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
          statusCode: 200,
          body: {
            name: 'Marcos'
          }
        }
        return new Promise(resolve => resolve(httpResponse));
      }
    }
    const controlleStub = new ControllerStub();

    const handleSpy = jest.spyOn(controlleStub, 'handle');

    const sut = new LogControllerDecorator(controlleStub);
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });
})