import { AddSurveyController } from './add-survey-controller';
import { Validation, HttpRequest, AddSurvey } from './add-survey-controller-protocols';
import { badRequest } from './../../../helpers/http/http-helper';
import { SurveyModel } from './../../../../domain/models/survey';

const makeSurvey = () => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }]
});

const makeFakeRequest = (): HttpRequest => ({
  body: makeSurvey()
});

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add(survey: any): Promise<SurveyModel> {
      return Promise.resolve(makeSurvey());
    }
  }

  const addSurveyStub = new AddSurveyStub();
  return addSurveyStub;
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  const validationStub = new ValidationStub();
  return validationStub;
}

interface SutTypes {
  sut: AddSurveyController;
  validationStub: Validation;
  addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub();
  const addSurveyStub = makeAddSurvey();
  const sut = new AddSurveyController(validationStub, addSurveyStub);

  return {
    sut,
    validationStub,
    addSurveyStub
  }
}


describe('AddSurvey Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { sut , validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());
    const httpRequest = makeFakeRequest();
    const response = await sut.handle(httpRequest);
    expect(response).toEqual(badRequest(new Error()));

  });

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyStub, 'add');

    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  })
})