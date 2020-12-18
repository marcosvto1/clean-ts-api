import { InvalidParamError } from '@/presentation/errors';
import { Validation } from '@/presentation/protocols';

export class CompareFieldsValidation implements Validation {

  constructor (  private readonly fieldName: string, private readonly fieldToComparaName: string) {}

  validate (input: any): Error {
    if (input[this.fieldName] !== input[this.fieldToComparaName]) {
      return new InvalidParamError(this.fieldToComparaName);
    }
  }
}