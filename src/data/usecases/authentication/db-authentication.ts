import { 
  Authentication,
  AuthenticationModel, 
  LoadAccountByEmailRepository, 
  AccountModel, 
  HashComparer, 
  TokenGenerator, 
  UpdateAccessTokenRepository, 
} from './db-authentication-protocols';


export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRespository: LoadAccountByEmailRepository;
  private readonly hashComparer: HashComparer;
  private readonly tokenGenerator: TokenGenerator;
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository;

  constructor(
    loadAccountByEmailRespository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator,
    updateAccessTokenRepository: UpdateAccessTokenRepository
    ) {
    this.loadAccountByEmailRespository = loadAccountByEmailRespository;
    this.hashComparer = hashComparer;
    this.tokenGenerator = tokenGenerator;
    this.updateAccessTokenRepository = updateAccessTokenRepository;
  }

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account: AccountModel = await this.loadAccountByEmailRespository.load(authentication.email);
    if (account) {
      const isEqual = await this.hashComparer.compare(authentication.password, account.password);
      if (isEqual) {
        const accessToken = await this.tokenGenerator.generate(account.id);
        if (accessToken) {
          await this.updateAccessTokenRepository.update(account.id, accessToken);
          return accessToken;
        }
      }
    }

    return null;
  }
}