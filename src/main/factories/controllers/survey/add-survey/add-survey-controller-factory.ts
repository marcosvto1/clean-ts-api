import { Controller } from '@/presentation/protocols/controller';
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeAddSurveyValidation } from './add-survey-validation-factory';
import { makeAddSurvey } from '@/main/factories/usecases/survey/add-survey/add-survey-factory';

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(makeAddSurveyValidation(), makeAddSurvey() )
  return makeLogControllerDecorator(controller);
}