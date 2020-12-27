import { HttpRequest, HttpResponse, Controller, LoadSurveyById, SaveSurveyResult, forbidden, InvalidParamError } from './save-survey-result-protocols';

export class SaveSurveyResultController implements Controller {
  
  constructor(
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params;
    const survey = await this.loadSurveyById.loadById(surveyId);
    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'));
    }
  }

}