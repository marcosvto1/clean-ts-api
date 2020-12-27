import { SaveSurveyResultRepository, SurveyResultModel, SaveSurveyResultModel, SaveSurveyResult } from './db-save-survey-result-protocols'
import { DbSaveSurveyResult } from './db-save-survey-result';
import MockDate from 'mockdate';

const makeSurveyResultData = () => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answers: 'any_answers',
  date: new Date(),
});

const makeSurveyResult = (): SurveyResultModel => Object.assign({}, makeSurveyResultData(), {id: 'any_id'});

const makeSaveSurveyResultRepositoryStub = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return Promise.resolve(makeSurveyResult());
    }
}
  return new SaveSurveyResultRepositoryStub();
}

type SutType = {
  sut: DbSaveSurveyResult,
  saveSurveyResultRepository: SaveSurveyResultRepository
}

const makeSut = () => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepositoryStub();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);
  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}

describe('DbAddSurvey Usecase', () => {

  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save');
    await sut.save(makeSurveyResultData());
    expect(addSpy).toHaveBeenCalledWith(makeSurveyResultData());
  });
});