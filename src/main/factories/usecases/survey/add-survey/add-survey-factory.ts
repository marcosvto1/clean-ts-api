import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository';
import { DbAddSurvey } from '../../../../../data/usecases/add-survey/db-add-survey';
import { AddSurvey } from '../../../../../domain/usecases/add-survey';

export const makeAddSurvey = (): AddSurvey => {
  const addSurveyMongoRepository = new SurveyMongoRepository();
  return new DbAddSurvey(addSurveyMongoRepository);
}