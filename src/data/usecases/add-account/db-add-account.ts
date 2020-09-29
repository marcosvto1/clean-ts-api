import {AddAccountRepository,  AddAccount, AddAccountModel, Hasher, AccountModel } from './db-add-account-protocols';

export class DbAddAccount implements AddAccount{
  private readonly hasher: Hasher;
  private readonly addAccountRespository: AddAccountRepository;

  constructor(hasher: Hasher, addAccountRespository: AddAccountRepository) {
    this.hasher = hasher;
    this.addAccountRespository = addAccountRespository;
  }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password);
    const account = await this.addAccountRespository.add(Object.assign({}, accountData, {password: hashedPassword}));
    return account;
  }
}