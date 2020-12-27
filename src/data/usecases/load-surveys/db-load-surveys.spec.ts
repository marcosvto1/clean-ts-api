import { LoadSurveys } from '@/domain/usecases/load-surveys';
import { SurveyModel } from '../../../domain/models/survey';
import { LoadSurveysRepository } from './../../protocols/db/survey/load-survey-repository';
import { DbLoadSurveys } from './db-load-surveys';
import MockDate from 'mockdate'

const makeFakeSurveys = (): SurveyModel[] => {
  return [
    {
      id: 'any_id',
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        }
      ],
      date: new Date()
    }
  ]
}

const makeLoadSurveysRepository = (): LoadSurveysRepository  => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return Promise.resolve(makeFakeSurveys());
    }
  }

  return new LoadSurveysRepositoryStub();
}

interface SutTypes {
  loadSurveysRepositoryStub: LoadSurveysRepository,
  sut: LoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepository();
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub);
  return {
    loadSurveysRepositoryStub,
    sut
  }
}

describe('DbLoadSurveys', () => {

  beforeAll(() => {
    MockDate.set(new Date())
  });

  afterAll(() => {
    MockDate.reset()
  });

  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    const loadSurveysRepositorySpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll');
    sut.load();
    expect(loadSurveysRepositorySpy).toHaveBeenCalled()
  });
  
  test('Should return a list of Surveys on success', async () => {
    const { sut } = makeSut();
    const surveys = await sut.load();
    expect(surveys).toEqual(makeFakeSurveys());
  });

  test('Should throw if LoadSurveysRepositor', async () => {
    const {sut, loadSurveysRepositoryStub } = makeSut();
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockReturnValueOnce(
      Promise.reject(new Error())
    );
    const promise = sut.load();

    expect(promise).rejects.toThrow();
  });

})