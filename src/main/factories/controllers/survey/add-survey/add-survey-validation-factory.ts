import { Validation } from '@/presentation/protocols/validation';
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators';

export const makeAddSurveyValidation = (): Validation => {
  const validations: Validation[] = [];
  for (const field of ['question', 'answers']) {
    validations.push(new RequiredFieldValidation(field));
  }

  const validationComposite = new ValidationComposite(validations);
  return validationComposite;
}