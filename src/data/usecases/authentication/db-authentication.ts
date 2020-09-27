import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import {Authentication, AuthenticationModel} from '../../../domain/usecases/authentication';
import { AccountModel } from '../../../domain/models/account';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRespository: LoadAccountByEmailRepository;
  constructor(loadAccountByEmailRespository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRespository = loadAccountByEmailRespository;
  }

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account: AccountModel = await this.loadAccountByEmailRespository.load(authentication.email);
    if (!account) {
      return null;
    }
    return "any_token";
  }
}