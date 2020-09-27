import { HashComparer } from './../../protocols/criptography/hash-comparer';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import {Authentication, AuthenticationModel} from '../../../domain/usecases/authentication';
import { AccountModel } from '../../../domain/models/account';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRespository: LoadAccountByEmailRepository;
  private readonly hashComparer: HashComparer;

  constructor(loadAccountByEmailRespository: LoadAccountByEmailRepository, hashComparer: HashComparer) {
    this.loadAccountByEmailRespository = loadAccountByEmailRespository;
    this.hashComparer = hashComparer;
  }

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account: AccountModel = await this.loadAccountByEmailRespository.load(authentication.email);
    if (account) {
      await this.hashComparer.compare(authentication.password, account.password);
    }
    return null;
  }
}