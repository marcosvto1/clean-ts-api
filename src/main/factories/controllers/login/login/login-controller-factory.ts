import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbAuthentication } from '@/main/factories/usecases/account/authentication/db-authentication-factory';
import { makeLoginValidation } from './login-validation-factory';
import { Controller } from '@/presentation/protocols/controller';
import { LoginController } from '@/presentation/controllers/auth/login/login-controller';

export const makeLoginController = (): Controller => {
  return makeLogControllerDecorator(
    new LoginController(makeDbAuthentication(), makeLoginValidation())
  );
}