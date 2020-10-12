import { makeLogControllerDecorator } from './../../decorators/log-controller-decorator-factory';
import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller';
import { LogMongoRepository } from '../../../../infra/db/mongodb/log/log-mongo-repository';
import { Controller } from '../../../../presentation/protocols';
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator';
import { makeSignUpValidation } from './signup-validation-factory';
import { makeDbAuthentication } from './../../usecases/authentication/db-authentication-factory';
import { makeAddAccount } from './../../usecases/add-account/add-account-factory';

export const makeSignUpController = (): Controller => {
  return makeLogControllerDecorator(new SignUpController(
    makeAddAccount(), 
    makeSignUpValidation(), 
    makeDbAuthentication()
  ));
}