import { DbLoadSurveyById } from './db-load-survey-by-id';
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { SurveyModel } from '@/domain/models/survey';
import MockDate from 'mockdate';

const makeFakeSurvey = (): SurveyModel => {
  return {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ],
    date: new Date()
  };
}

const makeLoadSurveyByIdRepositoryStub = () => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(id: string): Promise<SurveyModel> {
      return Promise.resolve(makeFakeSurvey());
    }
  }

  return new LoadSurveyByIdRepositoryStub();
}

type SutTypes = {
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository,
  sut: DbLoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepositoryStub();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);
  return {
    loadSurveyByIdRepositoryStub,
    sut
  }
}

describe('DbLoadSurveyByID', () => {

  beforeAll(() => {
    MockDate.set(new Date())
  });

  afterAll(() => {
    MockDate.reset()
  });

  test('Should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
    sut.loadById('any_id');
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  });

  test('Should return Survey on success', async () => {
    const { sut } = makeSut();
    const surveys = await sut.loadById('any_id');
    expect(surveys).toEqual(makeFakeSurvey());
  });


});