import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt.adapter';

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return Promise.resolve('hash');
  }
}));

type sutTypes = {
  sut: BcryptAdapter,
  salt: number;
}

const makeSut = (): sutTypes  => {
  const salt = 12;
  const sut = new BcryptAdapter(salt);
  return {sut, salt}
}

describe('Bcrypt Adapter', () => {
  test('should call bcrypt with correct values', async () => {
    const {sut, salt} = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.hash('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('should return a hash on success', async () => {
    const { sut } = makeSut();
    const hash = await sut.hash('any_value');
    expect(hash).toBe('hash');
  });

  test('should throws if brcrypt throws', async () => {
    const { sut } = makeSut();
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    );
    const promise = sut.hash('any_value');
    await expect(promise).rejects.toThrow();
  });
});

