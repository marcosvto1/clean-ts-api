import { AccountModel } from "../models/account";

export interface LoadAccountByToken {
  load (accessToken, role?: string): Promise<AccountModel>;
}