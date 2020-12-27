import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import { LoadAccountByEmailRepository } from '@/data/usecases/account/authentication/db-authentication-protocols';
import { AccountModel, AddAccountModel, Hasher } from './db-add-account-protocols';
import { DbAddAccount } from './db-add-account';

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(null) )
     }
  }
  return new LoadAccountByEmailRepositoryStub();
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    hash(value: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'));
    }
  }

  return new HasherStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRespositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountRespositoryStub();
};

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'hashed_password'
});

const makeFakerAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password'
})

type sutTypes = {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
}

const makeSut = (): sutTypes => {
  const addAccountRepositoryStub = makeAddAccountRepository();
  const hasherStub = makeHasher();
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub();
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub);
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
} 

describe('DbAddAccount Usecase', () => {
  test('Should call hasher with correct password', async () => {
    const {sut, hasherStub} = makeSut();
    const encryptSpy = jest.spyOn(hasherStub, 'hash');
    await sut.add(makeFakerAccountData());
    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  test('Should throw if hasher throws', async () => {
    const {sut, hasherStub} = makeSut();
    jest.spyOn(hasherStub, 'hash').mockResolvedValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    );
    const promise = sut.add(makeFakerAccountData());
    await expect(promise).rejects.toThrow();
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const {sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    await sut.add(makeFakerAccountData());
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'hashed_password'
    });
  });

  test('Should throw if AddAccountRespository throws', async () => {
    const {sut, addAccountRepositoryStub} = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockResolvedValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    );
    const promise = sut.add(makeFakerAccountData());
    await expect(promise).rejects.toThrow();
  });

  test('Should return an account on success', async () => {
    const { sut } = makeSut();
    const account = await sut.add(makeFakerAccountData());
    expect(account).toEqual(makeFakeAccount());
  });

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
    await sut.add(makeFakeAccount());
    expect(loadByEmailSpy).toHaveBeenCalledWith(makeFakeAccount().email);
  });

  test('Should return null if LoadAccountByEmailRepository return null', async () => {
    const {sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(makeFakeAccount()));
    const account = await sut.add(makeFakeAccount());
    expect(account).toBeNull();
  });



});