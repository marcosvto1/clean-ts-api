import { AccountModel, LoadAccountByToken, Decrypter, LoadAccountByTokenRepository } from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    const textplain = await this.decrypter.decrypt(accessToken);
    if (textplain) {
      const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role);
      if (account) {
        return account;
      }
    }
    return null;
  }
}