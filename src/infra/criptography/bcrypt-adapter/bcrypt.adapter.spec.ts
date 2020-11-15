import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt.adapter';

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return Promise.resolve('hash');
  },
  async compare (): Promise<boolean> {
    return Promise.resolve(true);
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

  describe('hash()', () => {
    test('should call hash with correct values', async () => {
      const {sut, salt} = makeSut();
      const hashSpy = jest.spyOn(bcrypt, 'hash');
      await sut.hash('any_value');
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
    });
  
    test('should return a valid on hash success', async () => {
      const { sut } = makeSut();
      const hash = await sut.hash('any_value');
      expect(hash).toBe('hash');
    });
  
    test('should throws if hash throws', async () => {
      const { sut } = makeSut();
      jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
      const promise = sut.hash('any_value');
      await expect(promise).rejects.toThrow();
    });
  });

  describe('compare()', () => {
    test('should call compare with correct values', async () => {
      const {sut} = makeSut();
      const compareSpy = jest.spyOn(bcrypt, 'compare');
      await sut.compare('any_value', 'any_hash');
      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
    });
  
    test('Should return true when compare succeeds', async () => {
      const { sut } = makeSut();
      const isValid = await sut.compare('any_value', 'any_hash'); 
      expect(isValid).toBe(true);
    });
  
    test('Should return false when compare fails', async () => {
      const { sut } = makeSut();
      jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(Promise.resolve(false));
      const isValid = await sut.compare('any_value', 'any_hash_invalid'); 
      expect(isValid).toBe(false);
    });
  
    test('should throws if compare throws', async () => {
      const { sut } = makeSut();
      jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
      const promise = sut.compare('any_value', 'any_hash');
      await expect(promise).rejects.toThrow();
    });
  
  });

 

 
});

