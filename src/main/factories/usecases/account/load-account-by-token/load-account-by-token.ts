import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { JwtAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter';
import { DbLoadAccountByToken } from '@/data/usecases/account/load-account-by-token/db-load-account-by-token';
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token';
import env from '@/main/config/env';

export const makeLoadAccountByToken = (): LoadAccountByToken => {
  const jwtDecrypter = new JwtAdapter(env.jwtSecret);
  const accountRespository = new AccountMongoRepository()
  return new DbLoadAccountByToken(jwtDecrypter, accountRespository);
}