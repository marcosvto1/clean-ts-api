import { Encrypter } from './../../../data/protocols/criptography/encrypter';
import { JwtAdapter } from './jwt-adapter';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  sign: async (): Promise<string> => {
    return Promise.resolve('any_token');
  }
}));

const makeSut = (): Encrypter => {
  return new JwtAdapter('secret');
}

describe('Jwt Adapter', () => {

  describe('Sign()', () => {
    test('Should call sign with corrects values', async () => {
      const sut = makeSut();
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any_id');
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
    });

    test('Should return a token on sign success', async () => {
      const sut = makeSut();
      const accessToken = await sut.encrypt('any_id');
      expect(accessToken).toBe('any_token');
    });

    test('Should throws if sign throws', async () => {
      const sut = makeSut();
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error();
      })
      const promise = sut.encrypt('any_id');
      await expect(promise).rejects.toThrow()
    });
  });


});