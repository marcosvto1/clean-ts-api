import {AddAccountRepository,  AddAccount, AddAccountModel, Hasher, AccountModel } from './db-add-account-protocols';

export class DbAddAccount implements AddAccount{

  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRespository: AddAccountRepository
  ) {}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password);
    const account = await this.addAccountRespository.add(Object.assign({}, accountData, {password: hashedPassword}));
    return account;
  }
}