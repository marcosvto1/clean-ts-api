import { DbAddSurvey } from './db-add-survey';
import { AddSurveyModel, AddSurvey, AddSurveyRepository } from './db-add-survey-protocols';
import MockDate from 'mockdate';

const makeSurvey = () => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
});

const makeAddSurveyRepository = () => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    add (data: AddSurveyModel): Promise<void> {
      return Promise.resolve(null);
    }
  }
  const addSurveyRepositoryStub = new AddSurveyRepositoryStub();

  return addSurveyRepositoryStub;
}

type sutTypes = {
  sut: AddSurvey,
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): sutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);
  return {sut, addSurveyRepositoryStub}
}

describe('DbAddSurvey Usecase', () => {

  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
    await sut.add(makeSurvey());
    expect(addSpy).toHaveBeenCalledWith(makeSurvey());
  });

  test('Should throws if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    jest.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    );
    const promise = sut.add(makeSurvey());
    expect(promise).rejects.toThrow()

  }) 
});

