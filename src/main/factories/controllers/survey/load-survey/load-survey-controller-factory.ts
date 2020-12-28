import { makeLoadSurveys } from './../../../usecases/survey/load-surveys/load-surveys-factory';
import { LoadSurveysController } from './../../../../../presentation/controllers/survey/load-survey/load-surveys-controller';
import { Controller } from '@/presentation/protocols/controller';

export const makeLoadSurveyController = (): Controller => {
  const controller = new LoadSurveysController(makeLoadSurveys())
  return controller;
}