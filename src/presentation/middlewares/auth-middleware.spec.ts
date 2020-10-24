import { AccountModel } from './../../domain/models/account';
import { LoadAccountByToken } from './../../domain/usecases/load-account-by-token';
import { AuthMiddleware } from './auth-middleware';
import { AccessDeniedError } from './../errors';
import { forbidden } from './../helpers/http/http-helper';
import { HttpRequest } from './../protocols/http';

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
});

const makeFakeRequest = (): HttpRequest => ({
  headers: {},
  body: {}
});

interface SutTypes {
  sut: AuthMiddleware,
  loadAccountByTokenStub: LoadAccountByToken
}

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    load(accessToken: string): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount());
    }
  }
  return new LoadAccountByTokenStub();
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub);
  return {
    sut,
    loadAccountByTokenStub
  }
}


describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exits in headers', async () => {
    const {sut} = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');
  
    await sut.handle({
      headers: {
        'x-access-token': 'any_token'
      }
    });
    expect(loadSpy).toHaveBeenCalledWith('any_token');
  });

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.resolve(null));
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  }); 
})