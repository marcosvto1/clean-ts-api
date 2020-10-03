import { 
  Authentication,
  AuthenticationModel, 
  LoadAccountByEmailRepository, 
  AccountModel, 
  HashComparer, 
  Encrypter, 
  UpdateAccessTokenRepository, 
} from './db-authentication-protocols';


export class DbAuthentication implements Authentication {

  constructor(
    private readonly loadAccountByEmailRespository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
    ) {}

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account: AccountModel = await this.loadAccountByEmailRespository.loadByEmail(authentication.email);
    if (account) {
      const isEqual = await this.hashComparer.compare(authentication.password, account.password);
      if (isEqual) {
        const accessToken = await this.encrypter.encrypt(account.id);
        if (accessToken) {
          await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken);
          return accessToken;
        }
      }
    }

    return null;
  }
}