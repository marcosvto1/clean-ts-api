import { serverError } from './../../../helpers/http/http-helper';
import { HttpRequest, HttpResponse, Controller, LoadSurveyById, SaveSurveyResult, forbidden, InvalidParamError } from './save-survey-result-protocols';

export class SaveSurveyResultController implements Controller {
  
  constructor(
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params;
      const survey = await this.loadSurveyById.loadById(surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }
      return null;
    } catch (error) {
      return serverError(new Error(error))
    }
  }
}