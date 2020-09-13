import { AddAccount } from './../../../domain/usecases/add-account';
import { Encrypter } from './../../protocols/encrypter';
import { DbAddAccount } from './db-add-account';

class EncrypterStub implements Encrypter {
  encrypt(value: string): Promise<string> {
    return new Promise((resolve) => resolve('hashed_password'));
  }
}

type sutTypes = {
  sut: AddAccount;
  encrypterStub: Encrypter;
}

const makeSut = (): sutTypes => {
  const encrypterStub = new EncrypterStub();
  const sut = new DbAddAccount(encrypterStub);
  return {
    sut,
    encrypterStub
  }
} 

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', () => {
    const {sut, encrypterStub} = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }
    sut.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });
});