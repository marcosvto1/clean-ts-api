import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { SignUpController } from '@/presentation/controllers/auth/signup/signup-controller';
import { Controller } from '@/presentation/protocols';
import { makeSignUpValidation } from './signup-validation-factory';
import { makeDbAuthentication } from '@/main/factories/usecases/account/authentication/db-authentication-factory';
import { makeAddAccount } from '@/main/factories/usecases/account/add-account/add-account-factory';

export const makeSignUpController = (): Controller => {
  return makeLogControllerDecorator(new SignUpController(
    makeAddAccount(), 
    makeSignUpValidation(), 
    makeDbAuthentication()
  ));
}