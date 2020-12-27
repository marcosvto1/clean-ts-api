import { makeLoadSurveyById } from './../../../usecases/survey/load-survey-by-id/load-survey-by-id-factory';
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller';
import { Controller } from '@/presentation/protocols/controller';
import { makeSaveSurvey } from '@/main/factories/usecases/survey-result/save-survey-result/save-survey-result-factory';

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(makeLoadSurveyById(), makeSaveSurvey());
  return controller;
}