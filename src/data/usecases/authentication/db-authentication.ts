import { TokenGenerator } from './../../protocols/criptography/token-generator';
import { HashComparer } from './../../protocols/criptography/hash-comparer';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import {Authentication, AuthenticationModel} from '../../../domain/usecases/authentication';
import { AccountModel } from '../../../domain/models/account';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRespository: LoadAccountByEmailRepository;
  private readonly hashComparer: HashComparer;
  private readonly tokenGenerator: TokenGenerator;

  constructor(loadAccountByEmailRespository: LoadAccountByEmailRepository, hashComparer: HashComparer, tokenGenerator: TokenGenerator) {
    this.loadAccountByEmailRespository = loadAccountByEmailRespository;
    this.hashComparer = hashComparer;
    this.tokenGenerator = tokenGenerator;
  }

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account: AccountModel = await this.loadAccountByEmailRespository.load(authentication.email);
    if (account) {
      await this.hashComparer.compare(authentication.password, account.password);
      const accessToken = await this.tokenGenerator.generate(account.id);
    }
    return null;
  }
}