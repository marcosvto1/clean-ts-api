import { LogControllerDecorator } from './../../decorators/log-controller-decorator';
import { makeLoginValidation } from './login-validation-factory';
import env from '../../config/env';
import { Controller } from '../../../presentation/protocols/controller';
import { LoginController } from '../../../presentation/controllers/login/login-controller';
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication';
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter';
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt.adapter';
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository';


export const makeLoginController = (): Controller => {
  const salt = 12;
  const accountMongoRepository = new AccountMongoRepository();
  const encrypter = new JwtAdapter(env.jwtSecret);
  const hashComparer = new BcryptAdapter(salt);

  const authentication = new DbAuthentication(
    accountMongoRepository,
    hashComparer,
    encrypter,
    accountMongoRepository
  );

  const loginController = new LoginController(authentication, makeLoginValidation());
  const logMongoRepository = new LogMongoRepository();


  return new LogControllerDecorator(loginController, logMongoRepository);
}