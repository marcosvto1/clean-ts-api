import { Authentication } from './../../../../domain/usecases/authentication';
import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication';
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter';
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt.adapter';
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository';
import env from '../../../config/env';


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