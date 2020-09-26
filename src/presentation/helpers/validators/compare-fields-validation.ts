import { InvalidParamError } from '../../errors/';
import { Validation } from './validation';

export class CompareFieldsValidation implements Validation {
  private readonly fieldName: string;
  private readonly fieldToComparaName: string;

  constructor (fieldName: string, fieldToCompareName: string) {
    this.fieldName = fieldName;
    this.fieldToComparaName = fieldToCompareName;
  }

  validate (input: any): Error {
    if (input[this.fieldName] !== input[this.fieldToComparaName]) {
      return new InvalidParamError(this.fieldToComparaName);
    }
  }
}