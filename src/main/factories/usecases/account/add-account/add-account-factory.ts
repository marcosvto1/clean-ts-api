import { AddAccount } from '@/domain/usecases/account/add-account';
import { DbAddAccount } from "@/data/usecases/account/add-account/db-add-account";
import { BcryptAdapter } from "@/infra/criptography/bcrypt-adapter/bcrypt.adapter";
import { AccountMongoRepository } from "@/infra/db/mongodb/account/account-mongo-repository";

export const makeAddAccount = (): AddAccount => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountRepository = new AccountMongoRepository();
  return new DbAddAccount(bcryptAdapter, accountRepository, accountRepository);
}