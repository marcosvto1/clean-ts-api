import { Authentication } from '@/domain/usecases/account/authentication';
import { DbAuthentication } from '@/data/usecases/account/authentication/db-authentication';
import { JwtAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter';
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt.adapter';
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import env from '@/main/config/env';

export const makeDbAuthentication = (): Authentication => {
  const salt = 12;
  const accountMongoRepository = new AccountMongoRepository();
  const encrypter = new JwtAdapter(env.jwtSecret);
  const hashComparer = new BcryptAdapter(salt);

  return new DbAuthentication(
    accountMongoRepository,
    hashComparer,
    encrypter,
    accountMongoRepository
  );

}