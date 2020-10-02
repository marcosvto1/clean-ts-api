import { JwtAdapter } from './jwt-adapter';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  sign: async (): Promise<string> => {
    return Promise.resolve('any_token');
  }
}));

describe('Jwt Adapter', () => {
  test('Should call sign with corrects values', async () => {
    const sut = new JwtAdapter('secret');
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id');
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id'}, 'secret');
  });

  test('Should return a token on sign success', async () => {
    const sut = new JwtAdapter('secret');
    const accessToken = await sut.encrypt('any_id');
    expect(accessToken).toBe('any_token');
  });
});