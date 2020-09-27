import { LogErrorRepository } from '../../data/protocols/db/log-error-repository';
import { AccountModel } from '../../domain/models/account';
import { serverError, ok } from '../../presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse } from './../../presentation/protocols';
import { LogControllerDecorator } from "./log";

class ControllerStub implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse: HttpResponse = {
      statusCode: 200,
      body: makeFakerAccount()
    }
    return new Promise(resolve => resolve(httpResponse));
  }
}

const makeControllerStub = () => {
  return new ControllerStub();
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }

  return new LogErrorRepositoryStub();
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

const makeFakerAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeFakerServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';
  return serverError(fakeError);
}

type SutTypes = {
  sut: LogControllerDecorator;
  controllerStub: ControllerStub;
  logErrorRepositoryStub: LogErrorRepository;
}

const makeSut = (): SutTypes => {
  const logErrorRepositoryStub = makeLogErrorRepository();
  const controllerStub = makeControllerStub();
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub);
  return {
    controllerStub,
    sut,
    logErrorRepositoryStub
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle ', async () => {
    const {sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    await sut.handle(makeFakeRequest());
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
  });

  test('Should return the same result of the controller ', async () => {
    const {sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakerAccount()));
  });

  test('Should call LogErrorRespository with correct error if controller returns a server error ', async () => {  
    const {sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
      new Promise(resolve =>  resolve(makeFakerServerError()))
    );
    await sut.handle(makeFakeRequest());
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
})