
import { SignUpController } from '../../presentation/controllers/signup/signup';
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { EmailValidatorAdapter } from './../../utils/email-validator-adapter';
import { BcryptAdapter } from '../../infra/criptography/bcrypt.adapter';
import { AccountMongoRepository } from './../../infra/db/mongodb/account-repository/account';


export const makeSignUpController = (): SignUpController => {
  const salt = 12;
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountRepository);
  return new SignUpController(emailValidatorAdapter, dbAddAccount);
}